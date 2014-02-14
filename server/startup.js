if (Meteor.isServer) {
  Meteor.startup(function () {
    //Proses.remove({});
    //Branches.remove({});
    //Proses.update({}, {"$set":{"updated": new Date()}});
    //Branches.update({}, {"$set":{"updated": new Date()}});
    //Counts.remove({});
    if (Proses.find().count() === 0) {
      Prose.create("My Brain on Zen", "index", "I'm Matthew Bunday and I love you.", false);
      Prose.create("I love Daria!", "i_love_daria", "Daria is seriously the best.", false);
    }

    var doCount = function() {
      var words = 0;
      var proses = 0;
      Proses.find().forEach(function (prose) {
        var branch = Branch.get(prose._id, prose.branch);
        //Branches.update(branch._id, {"$set": {active: true} }, {multi:true});
        words += branch.text.split(' ').length;
        proses++;
      });
      // Branches.find().forEach(function (branch) {
      //   if (! branch.updated) {
      //     Branches.update(branch._id, {"$set": {"updated": new Date()}});
      //   }
      // });
      //Branches.update({updated: {"$exists": false}}, {"$set":{"updated": new Date()}})
      Counts.insert({prose_count: proses, word_count: words, time: new Date()});
    }

    if (Counts.find().count() === 0) {
      doCount();
    }

    Meteor.setInterval(function() {
      doCount();
    }, 1000*60*60*8); // every eight hours

    Meteor.publish("proses", function() { return Proses.find(); });
    Meteor.publish("counts", function() { return Counts.find({},{sort: {_id:1}, limit: 1}); });
    Meteor.publish("prose_by_url", function(url) {return Proses.find({url: url})});
    Meteor.publish("branch_by_url", function(url) {return Branches.find({url: url, active: true})});
    Meteor.publish("branches_by_url", function(url) {return Branches.find({url: url})});
    Meteor.publish("users", function() {
      return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
    })
  });
}
