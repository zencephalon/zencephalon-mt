Proses = new Meteor.Collection("proses");

Router.configure({
  layoutTemplate: 'layout'
});

function getProse(url) {
  var prose = Proses.findOne({url: url});
  if (prose === undefined) {
    return {title: url, url: url}
  } else {
    return prose;
  }
}

Router.map(function() {
  this.route('home', {
    path: '/',
    action: function() {
      Router.go('prose', {url: 'index'})
    }
  });

  this.route('prose', {
    path: '/:url',
    template: 'prose',
    data: function() {
      return {prose: getProse(this.params.url)};
    },
    before: function() {
      Session.set("selected_prose", this.getData().prose);
    }
  });
});

if (Meteor.isClient) {
  Template.prose_edit.live_prose = function() {
    var o = {};
    ["title", "text", "url"].forEach(function(ele) {
      o[ele] = $("#prose_" + ele).val();
    });
    return o;
  }

  Template.prose_edit.prose = function() {
    return Session.get("selected_prose");
  }

  Template.prose_edit.settings = function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
      {
        token: '](',
        collection: Proses,
        field: "url",
        template: Template.prose_url
      }]
    }
  }

  Template.prose_edit.events({
    'click input.save': function() {
      var live_prose = Template.prose_edit.live_prose();
      var prose = Template.prose_edit.prose();
      if (prose._id !== undefined) {
        ["title", "text", "url"].forEach(function(ele) {
          prose[ele] = live_prose[ele];
        });
        Proses.update(prose['_id'], prose);
      } else {
        Proses.insert(live_prose);
      }
      Session.set("view_mode", true);
      Router.go('prose', {url: live_prose["url"]});
    }
  });

  Template.prose.view_mode = function() {
    return Session.get("view_mode");
  }

  Template.prose_view.prose = Template.prose_edit.prose;

  Template.prose_view.events({
    'click h2.edit_toggle': function() {
      Session.set("view_mode", false);
      Router.go(prose.url);
    }
  })

  Template.list_proses.proses = function() {
    return Proses.find({});
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Proses.remove({});
    if (Proses.find().count() === 0) {
      Proses.insert({title: "My Brain on Zen", text: "I'm Matthew Bunday and I love you.", url: "index"});
      Proses.insert({title: "I love Daria!", text: "Daria is seriously the best.", url: "i_love_daria"});
    }
  });
}
