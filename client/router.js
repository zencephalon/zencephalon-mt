Router.configure({
  layoutTemplate: 'layout'
});

getRouteData = function() {
  prose = Session.get("selected_prose");
  branch = Session.get("selected_branch");
  return {prose: prose, branch: branch};
}

setRouteSubscriptions = function(route, branch_name) {
  Meteor.subscribe("proses");
  prose = Prose.get(route.params.url);
  if (prose !== undefined) {
    Meteor.subscribe("branches", prose._id);
  }

  if (branch_name) {
    branch = Branch.get(prose._id, branch_name);
  } else {
    branch = Branch.get(prose._id, prose.branch);
  }

  Session.set("selected_prose", prose);
  Session.set("selected_branch", branch);
}

Router.map(function() {
  this.route('home', {
    path: '/',
    action: function() {
      Router.go('prose', {url: 'index'});
    }
  });

  this.route('list', {
    path: '/list',
    template: 'list_proses',
    before: function() {
      Meteor.subscribe("proses");
    }
  })

  this.route('prose', {
    path: '/:url',
    template: 'prose',
    data: getRouteData,
    before: function() {
      setRouteSubscriptions(this, false);
    }
  });

  this.route('branch', {
    path: '/:url/b/:branch_name',
    template: 'prose',
    data: getRouteData,
    before: function() {
      setRouteSubscriptions(this, this.params.branch_name);
    }
  })
});