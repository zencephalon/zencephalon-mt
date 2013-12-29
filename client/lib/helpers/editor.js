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

  insertText : function(str) {
    View.save();
    caret_pos = Session.get("saved_view").caret_pos;
    content = $('#prose_text').val();
    content = content.substr(0, caret_pos) + str + content.substr(caret_pos);
    $('#prose_text').val(content);
    View.set_caret(caret_pos + str.length);
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

  bindKeys : function() {
    Mousetrap.bind('ctrl+shift+s', function(e) { Editor.saveProse(true, true); return false; });
    Mousetrap.bind('ctrl+d', Editor.insertTimestamp);
    Mousetrap.bind('ctrl+z', Editor.insertTodo);
  },

  unbindKeys : function() {
    Mousetrap.unbind('ctrl+shift+s');
    Mousetrap.unbind('ctrl+d');
    Mousetrap.unbind('ctrl+z');
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