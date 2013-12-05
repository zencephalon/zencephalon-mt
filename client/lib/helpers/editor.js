Editor = {
  saveProse : function(new_revision, view_mode) {
    live_prose = Template.prose_edit.live_prose();
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
  }
}