Proses = new Meteor.Collection("proses");

Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('prose', {
    path: '/p/:_id',
    template: 'prose_new',
    data: function() {
      return {prose: Proses.findOne({_id: this.params._id})};
    }
  })
});

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return Session.get("selected_prose");
  };

  Template.prose_edit.prose_selected = function() {
    return !(Session.get("selected_prose") === undefined);
  }

  Template.prose_edit.prose = function() {
    if (Template.prose_edit.prose_selected()) {
      return Session.get("selected_prose");
    }
    return {title: "New Prose", text: "Start your new piece of prose here..."}
  }

  Template.prose_edit.live_prose = function() {
    var title = $("#prose_title").val();
    var text = $("#prose_text").val();
    return {title: title, text: text};
  }

  Template.prose_edit.events({
    'click input.save_new': function() {
      var prose = Template.prose_edit.live_prose();
      prose['live'] = true;
      Proses.insert(prose);
    },
    'click input.save_existing': function() {
      var prose = Template.prose_edit.prose();
      var live_prose = Template.prose_edit.live_prose();
      prose['title'] = live_prose['title'];
      prose['text'] = live_prose['text'];
      Proses.update(prose['_id'], prose);
    }
  });

  Template.prose_view.prose = Template.prose_edit.prose;

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
