if (Meteor.isClient) {
  Template.list_proses.proses = function() {
    return Proses.find({}, {sort: {updated: -1}});
  }
}