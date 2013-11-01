Proses = new Meteor.Collection("proses");

Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home',
    data: function() {
      return {prose: Proses.findOne({url: "index"})};
    },
    before: function() {
      Session.set("selected_prose", this.getData().prose);
    }
  });

  this.route('prose', {
    path: '/p/:url',
    template: 'prose',
    data: function() {
      return {prose: Proses.findOne({url: this.params.url})};
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
    var url = $("#prose_url").val();
    return {title: title, text: text, url: url};
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
        prose['url'] = live_prose['url'];
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
    Proses.remove({});
    if (Proses.find().count() === 0) {
      Proses.insert({title: "My Brain on Zen", text: "I'm Matthew Bunday and I love you.", url: "index"});
      Proses.insert({title: "I love Daria!", text: "Daria is seriously the best.", url: "i_love_daria"});
    }
  });
}
