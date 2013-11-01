Proses = new Meteor.Collection("proses");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return Session.get("selected_prose");
  };

  Template.prose.prose_selected = function() {
    return !(Session.get("selected_prose") === undefined);
  }

  Template.prose.prose = function() {
    if (Template.prose.prose_selected()) {
      return Session.get("selected_prose");
    }
    return {title: "New Prose", text: "Start your new piece of prose here..."}
  }

  Template.list_proses.proses = function() {
    return Proses.find({live: true});
  }

  Template.hello.events({
    'click input' : function() {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.list_prose.events({
    'click': function() {
      Session.set("selected_prose", this);
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Proses.find().count() === 0) {
      Proses.insert({title: "Welcome to Prosedy!", text: "Prosedy is quick way to write.", live: true});
    }
  });
}
