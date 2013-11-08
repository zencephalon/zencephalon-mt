if (Meteor.isServer) {
  Meteor.startup(function () {
    Proses.remove({});
    Branches.remove({});
    if (Proses.find().count() === 0) {
      createProse("My Brain on Zen", "index", "I'm Matthew Bunday and I love you.");
      createProse("I love Daria!", "i_love_daria", "Daria is seriously the best.");
    }

    Meteor.publish("proses", function() {return Proses.find();});
    Meteor.publish("branches", function(prose) {return Branches.find({prose: prose});});
  });
}