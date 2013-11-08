Branches = new Meteor.Collection("branches");

getBranch = function(id) {
  var branch = Branches.findOne({_id: id});
  return branch;
}