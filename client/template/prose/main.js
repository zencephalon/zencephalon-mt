Template.prose.view_mode = function() {
  return Session.get("view_mode");
}

Template.prose.rendered = function() {
  Journal.bindKeys();
}