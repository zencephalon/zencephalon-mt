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
      branch = getBranch(prose._id, prose.branch);
      return {prose: prose, branch: branch};
    },
    before: function() {
      Meteor.subscribe("proses");
      prose = this.getData().prose;
      if (prose !== undefined) {
        Meteor.subscribe("branches", prose._id);
      }
      Session.set("selected_prose", prose);
    }
  });
});
