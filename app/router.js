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
      prose = getProse(this.params.url);
      branch = getBranch(prose.branch);
      return {prose: prose, branch: branch};
    },
    before: function() {
      Meteor.subscribe("proses");
      Meteor.subscribe("branches");
      Session.set("selected_prose", this.getData().prose);
    }
  });
});
