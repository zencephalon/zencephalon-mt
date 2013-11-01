Proses = new Meteor.Collection("proses");

Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home',
    data: function() {
      return {prose: Proses.findOne({home: true})};
    },
    before: function() {
      Session.set("selected_prose", this.getData().prose);
    }
  });

  this.route('prose', {
    path: '/p/:_id',
    template: 'prose',
    data: function() {
      return {prose: Proses.findOne({_id: this.params._id})};
    }
  });
});

if (Meteor.isClient) {
  Template.prose_edit.live_prose = function() {
    var title = $("#prose_title").val();
    var text = $("#prose_text").val();
    return {title: title, text: text};
  }

  Template.prose_edit.prose = function() {
    return Session.get("selected_prose");
  }

  Template.prose_edit.events({
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Proses.remove({});
    if (Proses.find().count() === 0) {
      Proses.insert({title: "Welcome to Prosedy!", text: "Prosedy is quick way to write.", live: true, home: true});
    }
  });
}
