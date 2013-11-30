if (Meteor.isServer) {
  Meteor.startup(function () {
    //Proses.remove({});
    //Branches.remove({});
    //Proses.update({}, {"$set":{"updated": new Date()}});
    //Branches.update({}, {"$set":{"updated": new Date()}});
    if (Proses.find().count() === 0) {
      Prose.create("My Brain on Zen", "index", "I'm Matthew Bunday and I love you.", false);
      Prose.create("I love Daria!", "i_love_daria", "Daria is seriously the best.", false);
    }

    Meteor.publish("proses", function() {return Proses.find();});
    Meteor.publish("current_branch", function(prose, branch) {return Branches.find({prose: prose, name: branch});});
    Meteor.publish("branches", function(prose) {return Branches.find({prose: prose});});
    Meteor.publish("users", function() {
      return Meteor.users.find({}, {fields: {email: 1, profile: 1}});
    })
  });
}
