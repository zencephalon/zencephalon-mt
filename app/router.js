Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',
    action: function() {
      Router.go('prose', {url: 'index'});
    }
  });

  this.route('prose', {
    path: '/:url',
    template: 'prose',
    data: function() {
      return {prose: getProse(this.params.url)};
    },
    before: function() {
      Meteor.subscribe("proses");
      Session.set("selected_prose", this.getData().prose);
    }
  });
});
