Editor = {
  liveProse : function(target) {
    var o = {};
    ["title", "text", "url"].forEach(function(ele) {
      o[ele] = $("#prose_" + ele).val();
    });
    return o;
  },

  saveProse : function(target, new_revision, view_mode) {
    live_prose = this.liveProse(target);
    prose = State.prose();
    branch = Session.get("selected_branch");

    // always save a new revision if it has been over ten minutes
    if (branch !== undefined && branch.updated.getTime() + 60 * 1000 * 10 < new Date().getTime()) {
      new_revision = true;
    }

    // Save the viewport
    View.save(target);

    prose.save(live_prose, branch, new_revision);

    Session.set("view_mode", view_mode);
    // If we saved a new revision refresh because the url could have changed.
    if (new_revision) {
      Router.go('prose', {url: live_prose["url"]});
    }
  },

  editorFunc : function(target, func) {
    View.save(target);
    caret_pos = View.getCaret(target);
    content = $(target).val();
    func(caret_pos, content);
    return false;
  },

  insertText : function(str, target) {
    Editor.editorFunc(target, function(caret_pos, content) {
      target = $(target);
      console.log(caret_pos);
      target.val(content.substr(0, caret_pos) + str + content.substr(caret_pos));
      View.setCaret(caret_pos + str.length, target[0]);
    });
  },

  insertTimestamp : function(target) {
    date_str = new Date().toLocaleTimeString() + ': ';
    Editor.insertText(date_str, target);
    return false;
  },

  insertTodo : function(old, prose) {
    Editor.editorFunc(prose[0], function(caret_pos, content) {
      sel = prose.getSelection();

      if (sel.text.indexOf("- ()") === 0) {
        prose.val(content.replace(sel.text, sel.text.replace("- ()", "- (♥)")));
        View.setCaret(sel.end + 1, prose[0]);
      } else if (sel.text.indexOf("- (♥)") === 0) {
        prose.val(content.replace(sel.text, sel.text.replace("- (♥)", "- ()")));
        View.setCaret(sel.end - 1, prose[0]);
      } else {
        if (sel.text == "") {
          prose.insertText("- () I love  so I will ", old);
          View.setCaret(old + 12, prose[0]);
        } else {
          prose.val(content.replace(sel.text, "- () " + sel.text));
          View.setCaret(sel.end + 5, prose[0]);
        }
      }
    });
    return false;
  },

  scrollCursor : function(new_pos, target) {
      View.setCaret(new_pos, target);
      View.cursorScroll(target);
  },

  goSectionDown : function(target) {
    return Editor.editorFunc(target, function(caret_pos, content) {
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

  goSectionUp : function(target) {
    return Editor.editorFunc(target, function(caret_pos, content) {
      header_str = "\n####";
      top_content = content.substr(0, caret_pos);
      new_pos = top_content.lastIndexOf(header_str);

      if (new_pos == -1) {
        new_pos = content.length;
      }

      Editor.scrollCursor(new_pos, target);
    });
  },

  goDir : function(dir, target) {
    prose = $(target);
    sel = prose.getSelection();
    if (sel.length == 0) {
      sel.start -= dir ? 1 : -1;
      prose.setSelection(sel.start, sel.start);
    } else {
      prose.collapseSelection(dir);
    }
    return false;
  },

  goLeft : function(target) {
    return Editor.goDir(true, target);
  },

  goRight : function(target) {
    return Editor.goDir(false, target);
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
    Mousetrap.bind('mod+shift+s', function(e) { Editor.saveProse(e.target, true, true); return false; });
    Mousetrap.bind('ctrl+d', function(e) {
      Editor.insertTimestamp(e.target);
      return false;
    });
    Mousetrap.bind('ctrl+n', function(e) {
      Editor.goSectionDown(e.target);
      return false;
    });
    Mousetrap.bind('ctrl+b', function(e) {
      Editor.goSectionUp(e.target);
      return false;
    });
    Mousetrap.bind('ctrl+x', function(e) {
      Editor.goLeft(e.target);
      return false;
    });
    Mousetrap.bind('ctrl+c', function(e) {
      Editor.goRight(e.target);
      return false;
    });
    Mousetrap.bind('ctrl+enter', function(e) {Editor.loadSubedit(e)});
    // Create new DeftDraft object.
    var dd = new DeftDraft($('#prose_text'));
    Mousetrap.bind('ctrl+z', function(e) {
      target = $(e.target);
      dd = new DeftDraft(target);
      old = target.getSelection().start;
      View.setCaret(old, e.target); 
      dd.command('n', 'l'); 
      Editor.insertTodo(old, target); 
      return false;
    });
    // Set the key bindings.
    ['w', 's', 'q'].forEach(function (letter) {
      Mousetrap.bind('ctrl+' + letter, function(e) {
        target = $(e.target);
        dd = new DeftDraft(target);
        dd.command('n', letter); View.cursorScroll(e.target); 
        $(e.target).trigger('mouseup');
        return false;
      });
      Mousetrap.bind('ctrl+shift+' + letter, function(e) {
        target = $(e.target);
        dd = new DeftDraft(target);
        dd.command('p', letter); View.cursorScroll(e.target); return false});
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
      View.restore();

      Session.set("just_loaded", false);
    }
  }
}