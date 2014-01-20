Template.prose.view_mode = function() {
  return Session.get("view_mode");
}

Template.prose.rendered = function() {
  $(document).ready(function() {
    Mousetrap.bind('ctrl+s', function(e) { 
      if (View.editMode()) { 
        Editor.saveProse(false, true);
      } else { 
        Session.set("view_mode", false);
      }
      return false; 
    });
  });
}