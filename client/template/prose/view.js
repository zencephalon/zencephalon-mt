Template.prose_view.prose = Template.prose_edit.prose;

Template.prose_view.events({
  'click h2.title': function() {
    Session.set("view_mode", false);
  }
});

Template.prose_view.rendered = function() {
}