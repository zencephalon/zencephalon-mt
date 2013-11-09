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
      prose = Session.get("selected_prose");
      branch = Session.get("selected_branch");
      return {prose: prose, branch: branch};
    },
    before: function() {
      Meteor.subscribe("proses");
      prose = getProse(this.params.url);
      if (prose !== undefined) {
        Meteor.subscribe("branches", prose._id);
      }
      branch = getBranch(prose._id, prose.branch);
      Session.set("selected_prose", prose);
      Session.set("selected_branch", branch);
    }
  });

  this.route('branch', {
    path: '/:url/b/:branch_name',
    template: 'prose',
    data: function() {
      prose = Session.get("selected_prose");
      branch = Session.get("selected_branch");
      return {prose: prose, branch: branch};
    },
    before: function() {
      Meteor.subscribe("proses");
      prose = getProse(this.params.url);
      if (prose !== undefined) {
        Meteor.subscribe("branches", prose._id);
      }
      branch = getBranch(prose._id, this.params.branch_name);
      Session.set("selected_prose", prose);
      Session.set("selected_branch", branch);
    }
  })
});
