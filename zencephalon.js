if (Meteor.isClient) {
  Template.prose.view_mode = function() {
    return Session.get("view_mode");
  }

  Template.prose_view.prose = Template.prose_edit.prose;

  Template.prose_view.events({
    'click h2.edit_toggle': function() {
      Session.set("view_mode", false);
      Router.go('prose', {url: Template.prose_view.prose().url});
    }
  })

  Template.list_proses.proses = function() {
    return Proses.find({});
  }
}