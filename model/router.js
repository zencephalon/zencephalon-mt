Router.configure({
  layoutTemplate: 'layout'
});

getRouteData = function(url, branch_name) {
  prose = Prose.get(url);
  branch = Branch.getByUrl(url, branch_name);
  Session.set("selected_prose", prose);
  Session.set("selected_branch", branch);
  Session.set("just_loaded", true);
  return {prose: prose, branch: branch};
}

if (Meteor.isServer) {
  FastRender.onAllRoutes(function(urlPath) {
    this.subscribe("branch_by_url", "__journal_template__");
    this.subscribe('counts');
  })
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
    fastRender: true,
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
  });

  this.route('user_admin', {
    path: '/z/users',
    template: 'user_admin',
    waitOn: function() {
      Meteor.subscribe("users");
    },
    data: function() {
      return {users: _.map(Meteor.users.find().fetch(), function(user) {
          if (user.emails !== undefined) {
            return user.emails[0].address;
          } else {
            return "No email";
          }
        })
      }
    }
  });

  this.route('prose', {
    path: '/:url',
    template: 'prose',
    data: getRouteData,
    fastRender: true,
    waitOn: function() {
      Meteor.subscribe("proses");
      Meteor.subscribe("branch_by_url", this.params.url);
    },
    before: function() {
      Meteor.subscribe("branches_by_url", this.params.url);
    },
    data: function() {
      return getRouteData(this.params.url, false);
    }
  });

  this.route('branch', {
    path: '/:url/b/:branch_name',
    template: 'prose',
    data: getRouteData,
    fastRender: true,
    waitOn: function() {
      Meteor.subscribe("proses");
      Meteor.subscribe("branch_by_url", this.params.url);
      Meteor.subscribe("branches_by_url", this.params.url);
    },
    data: function() {
      return getRouteData(this.params.url, this.params.branch_name);
    },
  });

  this.route('diff', {
    path: '/:url/b/:branch_name/:diff_branch_name',
    template: 'diff',
    waitOn: function() {
      return Meteor.subscribe('proses');
    },
    before: function() {
      prose = Prose.get(this.params.url);
      this.subscribe("branches", prose._id).wait();
    },
    data: function() {
      prose = Prose.get(this.params.url);
      branch_name = this.params.branch_name;
      diff_branch_name = this.params.diff_branch_name;

      return {prose: prose, diff: Differ.diff(prose, branch_name, diff_branch_name)};
    }
  })
});