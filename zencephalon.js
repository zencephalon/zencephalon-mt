if (Meteor.isClient) {
  Template.prose.view_mode = function() {
    return Session.get("view_mode");
  }

  Template.list_proses.proses = function() {
    return Proses.find({});
  }
}