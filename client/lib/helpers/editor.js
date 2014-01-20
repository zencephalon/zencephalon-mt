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
    prose = Session.get("selected_prose");
    branch = Session.get("selected_branch");

    // always save a new revision if it has been over ten minutes
    if (branch !== undefined && branch.updated.getTime() + 60 * 1000 * 10 < new Date().getTime()) {
      new_revision = true;
    }

    // Save the viewport
    View.save();

    Prose.save(prose, live_prose, branch, new_revision);

    Session.set("view_mode", view_mode);
    // If we saved a new revision refresh because the url could have changed.
    if (new_revision) {
      Router.go('prose', {url: live_prose["url"]});
    }
  },

  editorFunc : function(func) {
    View.save();
    caret_pos = Session.get("saved_view").caret_pos;
    content = $('#prose_text').val();
    func(caret_pos, content);
    return false;
  },

  insertText : function(str) {
    Editor.editorFunc(function(caret_pos, content) {
      $('#prose_text').val(content.substr(0, caret_pos) + str + content.substr(caret_pos));
      View.set_caret(caret_pos + str.length);
    });
  },

  insertTimestamp : function() {
    date_str = new Date().toLocaleTimeString() + ': ';
    Editor.insertText(date_str);
    return false;
  },

  insertTodo : function() {
    Editor.insertText("- [] ");
    return false;
  },

  scrollCursor : function(new_pos) {
      View.set_caret(new_pos);
      View.cursor_scroll();
  },

  goSectionDown : function() {
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

      Editor.scrollCursor(new_pos);
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

  bindKeys : function() {
    Mousetrap.bind('ctrl+shift+s', function(e) { Editor.saveProse(true, true); return false; });
    Mousetrap.bind('ctrl+d', Editor.insertTimestamp);
    Mousetrap.bind('ctrl+z', Editor.insertTodo);
    Mousetrap.bind('ctrl+n', Editor.goSectionDown);
    Mousetrap.bind('ctrl+b', Editor.goSectionUp);
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