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
    },
    before: function() {
      Session.set("selected_prose", this.getData().prose);
    }
  });

  this.route('prose_new', {
    path: '/p/new',
    template: 'prose',
    data: function() {
      return {prose: {title: "New Prose", text: ""}};
    },
    before: function() {
      Session.set("selected_prose", null);
    }
  })
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
    'click input.save': function() {
      var live_prose = Template.prose_edit.live_prose();
      var prose = Template.prose_edit.prose();
      if (prose !== null && prose !== undefined) {
        prose['title'] = live_prose['title'];
        prose['text'] = live_prose['text'];
        Proses.update(prose['_id'], prose);
      } else {
        Proses.insert(live_prose);
      }
    }
  });

  Template.prose_view.prose = Template.prose_edit.prose;

  Template.list_proses.proses = function() {
    return Proses.find({});
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Proses.remove({});
    if (Proses.find().count() === 0) {
      Proses.insert({title: "Welcome to Prosedy!", text: "Prosedy is quick way to write.", home: true});
    }
  });
}
