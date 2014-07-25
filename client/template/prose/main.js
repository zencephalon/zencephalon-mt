Template.prose.view_mode = function() {
  return Session.get("view_mode");
}

Template.prose.rendered = function() {
  $(document).ready(function() {
    Mousetrap.bind('mod+s', function(e) { 
      if (View.editMode()) { 
        Editor.saveProse(e.target);
        Session.set("view_mode", true);
      } else { 
        Session.set("view_mode", false);
        View.restore();
      }
      return false; 
    });
  });
}