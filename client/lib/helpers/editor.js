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
    prose = Template.prose_edit.prose();
    branch = Session.get("selected_branch");

    // Save the viewport
    View.save();

    Prose.save(prose, live_prose, branch, new_revision);

    Session.set("view_mode", view_mode);
    // If we saved a new revision refresh because the url could have changed.
    if (new_revision) {
      Router.go('prose', {url: live_prose["url"]});
    }
  },

  insertTimestamp : function() {
    View.save();
    caret_pos = Session.get("saved_view").caret_pos;
    content = $('#prose_text').val();
    d = new Date();
    date_str = d.toLocaleTimeString() + ': ';
    content = content.substr(0, caret_pos) + date_str + content.substr(caret_pos);
    $('#prose_text').val(content);
    View.set_caret(caret_pos + date_str.length);
    // Crazy, this is actually overriding a readline shortcut to delete a character in OSX. 
    // That is useless to me, so I'm removing it.
    return false;
  },

  bindKeys : function() {
    Mousetrap.bind('ctrl+s', function(e) { Editor.saveProse(true, true); return false; });
    Mousetrap.bind('ctrl+d', Editor.insertTimestamp);
  },

  unbindKeys : function() {
    Mousetrap.unbind('ctrl+s');
    Mousetrap.unbind('ctrl+d');
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