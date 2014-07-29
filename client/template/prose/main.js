Template.prose.view_mode = function() {
  return View.viewMode(this.prose.url);
}

Template.prose.rendered = function() {
  $(document).ready(function() {
    Mousetrap.bind('mod+s', function(e) { 
      if (View.viewMode(prose.url)) { 
        Editor.saveProse(e.target);
        View.save(e.target);
        View.setViewMode(prose.url, true);
      } else { 
        View.setViewMode(prose.url, false);
        setTimeout(View.restore, 25);
      }
      return false; 
    });
  });
}