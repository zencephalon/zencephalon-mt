if (Meteor.isServer) {
  Meteor.startup(function () {
    //Proses.remove({});
    if (Proses.find().count() === 0) {
      Proses.insert({title: "My Brain on Zen", text: "I'm Matthew Bunday and I love you.", url: "index"});
      Proses.insert({title: "I love Daria!", text: "Daria is seriously the best.", url: "i_love_daria"});
    }

    Meteor.publish("proses", function() {return Proses.find();});
  });
}