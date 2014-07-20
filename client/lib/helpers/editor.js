Editor = {
  liveProse : function() {
    var o = {};
    ["title", "text", "url"].forEach(function(ele) {
      o[ele] = $("#prose_" + ele).val();
    });
    return o;
  },

  saveProse : function(new_revision, view_mode) {
    live_prose = this.liveProse();
    prose = State.prose();
    branch = Session.get("selected_branch");

    // always save a new revision if it has been over ten minutes
    if (branch !== undefined && branch.updated.getTime() + 60 * 1000 * 10 < new Date().getTime()) {
      new_revision = true;
    }

    // Save the viewport
    View.save();

    prose.save(live_prose, branch, new_revision);

    Session.set("view_mode", view_mode);
    // If we saved a new revision refresh because the url could have changed.
    if (new_revision) {
      Router.go('prose', {url: live_prose["url"]});
    }
  },

  editorFunc : function(func) {
    View.save();
    caret_pos = View.getCaret();
    content = $('#prose_text').val();
    func(caret_pos, content);
    return false;
  },

  insertText : function(str, target) {
    Editor.editorFunc(function(caret_pos, content) {
      target.val(content.substr(0, caret_pos) + str + content.substr(caret_pos));
      View.setCaret(caret_pos + str.length, target);
    });
  },

  insertTimestamp : function(target) {
    date_str = new Date().toLocaleTimeString() + ': ';
    Editor.insertText(date_str, target);
    return false;
  },

  insertTodo : function(old, prose) {
    Editor.editorFunc(function(caret_pos, content) {
      sel = prose.getSelection();

      if (sel.text.indexOf("- ()") === 0) {
        prose.val(content.replace(sel.text, sel.text.replace("- ()", "- (♥)")));
        View.setCaret(sel.end + 1, prose);
      } else if (sel.text.indexOf("- (♥)") === 0) {
        prose.val(content.replace(sel.text, sel.text.replace("- (♥)", "- ()")));
        View.setCaret(sel.end - 1, prose);
      } else {
        if (sel.text == "") {
          prose.insertText("- () I love  so I will ", old);
          View.setCaret(old + 12, prose);
        } else {
          prose.val(content.replace(sel.text, "- () " + sel.text));
          View.setCaret(sel.end + 5, prose);
        }
      }
    });
    return false;
  },

  scrollCursor : function(new_pos, target) {
      View.setCaret(new_pos, target);
      View.cursorScroll();
  },

  goSectionDown : function(target) {
    return Editor.editorFunc(function(caret_pos, content) {
      header_str = "\n####";
      bottom = content.substr(caret_pos);
      new_pos = bottom.indexOf(header_str);

      if (new_pos == -1) {
        new_pos = content.indexOf(header_str);
      } else {
        if (new_pos == 0) {
          next_sec = bottom.substr(new_pos + header_str.length).indexOf(header_str) + header_str.length;
        } else {
          next_sec = bottom.substr(new_pos).indexOf(header_str);
        }

        if (next_sec - header_str.length == -1) {
          new_pos = content.length;
        } else {
          new_pos = caret_pos + new_pos + next_sec;
        }
      }

      Editor.scrollCursor(new_pos, target);
    });
  },

  goSectionUp : function() {
    return Editor.editorFunc(function(caret_pos, content) {
      header_str = "\n####";
      top_content = content.substr(0, caret_pos);
      new_pos = top_content.lastIndexOf(header_str);

      if (new_pos == -1) {
        new_pos = content.length;
      }

      Editor.scrollCursor(new_pos);
    });
  },

  goDir : function(dir) {
    prose = $('#prose_text');
    sel = prose.getSelection();
    if (sel.length == 0) {
      sel.start -= dir ? 1 : -1;
      prose.setSelection(sel.start, sel.start);
    } else {
      prose.collapseSelection(dir);
    }
    return false;
  },

  goLeft : function() {
    return Editor.goDir(true);
  },

  goRight : function() {
    return Editor.goDir(false);
  },

  loadSubedit : function(e) {
    e.preventDefault();
    var target = $(e.target);
    var selection = target.getSelection();
    var sub_prose = Proses.get(selection.text);
    if (sub_prose !== undefined) {
      Meteor.subscribe("branch_by_url", selection.text);
      UI.insert(UI.renderWithData(Template.prose_subedit, {branch: sub_prose.getBranch(), prose: sub_prose}), e.target.parentNode, e.target.nextSibling);
    }
  },

  bindKeys : function() {
    Mousetrap.bind('mod+shift+s', function(e) { Editor.saveProse(true, true); return false; });
    Mousetrap.bind('ctrl+d', Editor.insertTimestamp);
    Mousetrap.bind('ctrl+n', Editor.goSectionDown);
    Mousetrap.bind('ctrl+b', Editor.goSectionUp);
    Mousetrap.bind('ctrl+x', Editor.goLeft);
    Mousetrap.bind('ctrl+c', Editor.goRight);
    Mousetrap.bind('ctrl+enter', function(e) {Editor.loadSubedit(e)});
    // Create new DeftDraft object.
    var dd = new DeftDraft($('#prose_text'));
    Mousetrap.bind('ctrl+z', function(e) {
      target = $(e.target);
      dd = new DeftDraft(target);
      old = target.getSelection().start;
      View.setCaret(old, target); 
      dd.command('n', 'l'); 
      Editor.insertTodo(old, target); 
      return false;
    });
    // Set the key bindings.
    ['w', 's', 'q'].forEach(function (letter) {
      Mousetrap.bind('ctrl+' + letter, function(e) {
        dd.command('n', letter); View.cursorScroll(); 
        $(e.target).trigger('mouseup');
        return false;
      });
      Mousetrap.bind('ctrl+shift+' + letter, function() {dd.command('p', letter); View.cursorScroll(); return false});
    });
},

  unbindKeys : function() {
    Mousetrap.unbind('ctrl+shift+s');
    Mousetrap.unbind('ctrl+d');
    Mousetrap.unbind('ctrl+z');
    Mousetrap.unbind('ctrl+n');
    Mousetrap.unbind('ctrl+b');
  },

  initView : function() {
    this.bindKeys();

    if (Session.get("just_loaded")) {
      // Restore the viewport
      $("#prose_text").autosize();
      View.restore();

      Session.set("just_loaded", false);
    }
  }
}