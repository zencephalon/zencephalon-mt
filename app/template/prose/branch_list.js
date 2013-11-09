if (Meteor.isClient) {
  Template.list_branch.prose_url = function() {
    prose = Session.get("selected_prose");
    if (prose !== undefined) {
      return prose.url;
    }
  }

  Template.branch_list.branches = function() {
    if (Session.get("selected_prose") !== undefined) {
      return Branches.find({prose: Session.get("selected_prose")._id});
    }
  };
}