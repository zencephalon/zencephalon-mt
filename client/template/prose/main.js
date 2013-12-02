Template.prose.view_mode = function() {
  return Session.get("view_mode");
}

Template.prose.rendered = function() {
  Mousetrap.bind('ctrl+j', function(e) { 
    j = Journal.today(); 
    Session.set("view_mode", false);
    Router.go('prose', {url: j}); 
    return false;
  });
}