if (Meteor.isServer) {
  Meteor.startup(function () {
    //_Proses.remove({});
    //_Branches.remove({});
    //Proses.update({}, {"$set":{"updated": new Date()}});
    //Branches.update({}, {"$set":{"updated": new Date()}});
    //_Counts.remove({});
    if (_Proses.find().count() === 0) {
      Proses.create("My Brain on Zen", "index", "I'm Matthew Bunday and I love you.", false);
      Proses.create("I love Daria!", "i_love_daria", "Daria is seriously the best.", false);
      _Proses._ensureIndex({url: 1}, {unique: true});
    }

    if (_Counts.find().count() === 0) {
      Counts.doCount();
    }

    Meteor.setInterval(function() {
      Counts.doCount();
    }, 1000*60*60*8); // every eight hours

    Meteor.publish("proses", function() { return _Proses.find(); });
    Meteor.publish("proses_public", function() { return _Proses.find({journal: {'$ne': true}, private: {'$ne': true}})});
    Meteor.publish("counts", Counts._publication_single);
    Meteor.publish("prose_by_url", function(url) {return _Proses.find({url: url})});
    Meteor.publish("branch_by_url", function(url) {return _Branches.find({url: url, active: true})});
    Meteor.publish("branches_by_url", function(url) {return _Branches.find({url: url})});
    Meteor.publish("users", function() {
      return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
    })
  });
}
