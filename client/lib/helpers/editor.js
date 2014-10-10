Editor = {
  liveProse : function(target) {
    var o = {};
    ["title", "text", "url"].forEach(function(ele) {
      o[ele] = target.find("#prose_" + ele).val();
    });
    return o;
  },

  saveProse : function(target) {
    var parent = Editor.container($(target));

    var prose = Prose.get(parent.data("url"));
    var branch = prose.getBranch();

    var liveProse = Editor.liveProse(parent);

    new_revision = (branch !== undefined && 
      (branch.updated.getTime() + 60 * 1000 * 10) < new Date().getTime());

    prose.save(liveProse, branch, new_revision);
  },

  togglePrivate : function(target) {
    prose = Prose.get($(target.parentNode).data("url"));
    prose.togglePrivate();
  },

  container : function(target) {
    return target.parents('.subedit');
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

  loadSubedit : function(url, target) {
    var sub_prose = Prose.get(url);
    if (sub_prose !== undefined) {
      Meteor.subscribe("branch_by_url", url);
      UI.renderWithData(Template.prose, {branch: sub_prose.getBranch(), prose: sub_prose}, target.parentNode.parentNode.parentNode, target.parentNode.parentNode.nextSibling);
    }
  },

  loadSubeditFromTargetSelection : function(target) {
    var $target = $(target);
    var selection = $target.getSelection();
    Editor.loadSubedit(selection.text, target);
  },

  ddFunction : function(target, func) {
    dd = new DeftDraft($(target));
    func(dd, target);
    return false;
  },

  cycle : function(target) {
    var id = "#prose_text";
    if ("#" + $(target).attr('id') === id) {
      View.save(target);
      var next = $(target).parent().parent().next(".sub_container");
      input = ((next.length !== 0) ? next.find(id) : $(id)).eq(0).focus();
      View.restore(input.parent().parent().data('url'));
      return false;
    }
    return true;
  },

  toggle : function(target, editorFunc, toggledFunc) {
    if (target.tagName === 'TEXTAREA') {
      prose_url = $(target).parent().data('url');
      Editor.saveProse(target);

      View.save(target);

      editorFunc();

      Session.set("last_saved", prose_url);
    } else {
      toggledFunc();

      last_saved = Session.get("last_saved");
      if (last_saved !== undefined) {
        View.setViewMode(last_saved, false);
        View.restore_delayed(last_saved);
      }
    }
    return false;
  },

  toggleView : function(target) {
    return Editor.toggle(target, function() {
      View.save(target);
      View.setViewMode(prose_url, true);
    }, function() {});
  },

  toggleStealth : function(target) {
    hidden_tog = function() {
      $('body').toggleClass('hidden');
    }
    return Editor.toggle(target, hidden_tog, hidden_tog);
  },

  bindKeys : function() {
    Mousetrap.bind('ctrl+shift+space', function(e) {
      return Editor.toggleStealth(e.target);
    });
    Mousetrap.bind('tab', function(e) {
      return Editor.cycle(e.target);
    });
    Mousetrap.bind('mod+s', function(e) {
      return Editor.toggleView(e.target);
    });
    Mousetrap.bind('ctrl+shift+t', function(e) {
      Editor.loadSubedit("todo", e.target);
      return false;
    });
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
    Mousetrap.bind('ctrl+enter', function(e) {Editor.loadSubeditFromTargetSelection(e.target); return false});

    Mousetrap.bind('ctrl+z', function(e) {
      return Editor.ddFunction(e.target, function(dd, target) {
        old = $(target).getSelection().start;
        View.setCaret(old, target); 
        dd.command('n', 'l'); 
        Editor.insertTodo(old, $(target)); 
      });
    });

    Mousetrap.bind('ctrl+p', function(e) {
      Editor.togglePrivate(e.target);
      return false;
    });

    function ddKeyFunc(direction, letter) {
      return function(dd, target) {
        dd.command(direction, letter); 
        $(target).trigger('mouseup');
        View.cursorScroll(target); 
      }
    }

    // Set the key bindings.
    ['w', 's', 'q'].forEach(function (letter) {
      Mousetrap.bind('ctrl+' + letter, function(e) {
        return Editor.ddFunction(e.target, ddKeyFunc('n', letter));
      });
      Mousetrap.bind('ctrl+shift+' + letter, function(e) {
        return Editor.ddFunction(e.target, ddKeyFunc('p', letter));
      });
    });
},

  unbindKeys : function() {
    Mousetrap.unbind('ctrl+shift+s');
    ['w', 's', 'q'].forEach(function (letter) {
      Mousetrap.unbind('ctrl+' + letter);
      Mousetrap.unbind('ctrl+shift+' + letter);
    });
    ['d', 'z', 'n', 'b', 'p'].forEach(function(letter) {
      Mousetrap.unbind('ctrl' + letter);
    });
  },

  initView : function() {
    this.bindKeys();
  }
}