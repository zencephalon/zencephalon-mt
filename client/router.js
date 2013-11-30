Router.configure({
  layoutTemplate: 'layout'
});

getRouteData = function() {
  return {prose: Session.get("selected_prose"), branch: Session.get("selected_branch")};
}

setRouteSubscriptions = function(route, branch_name) {
  Meteor.subscribe("proses");
  prose = Prose.get(route.params.url);
  if (prose !== undefined) {
    if (branch_name) {
      Meteor.subscribe("current_branch", prose._id, branch_name);
      branch = Branch.get(prose._id, branch_name);
    } else {
      Meteor.subscribe("current_branch", prose._id, branch_name);
      branch = Branch.get(prose._id, prose.branch);
    }
    Meteor.subscribe("branches", prose._id);
  }

  Session.set("selected_prose", prose);
  Session.set("selected_branch", branch);
  Session.set("just_loaded", true);
}

Router.map(function() {
  this.route('home', {
    path: '/',
    action: function() {
      Router.go('prose', {url: 'index'});
    }
  });

  this.route('prose_list', {
    path: '/z/prose',
    template: 'list_proses',
    waitOn: function() {
      Meteor.subscribe("proses");
    },
    data: function() {
      return {proses: Proses.find({journal: {"$ne": true}}, {sort: {updated: -1}})};
    }
  });

  this.route('journal_list', {
    path: '/z/journal',
    template: 'list_proses',
    waitOn: function() {
      Meteor.subscribe("proses");
    },
    data: function() {
      return {proses: Proses.find({journal: true}, {sort: {updated: -1}})};
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
