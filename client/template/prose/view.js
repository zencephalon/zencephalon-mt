if (Meteor.isClient) {
  Template.prose_view.prose = Template.prose_edit.prose;

  Template.prose_view.events({
    'click h2.edit_toggle': function() {
      Session.set("view_mode", false);
    }
  });
}