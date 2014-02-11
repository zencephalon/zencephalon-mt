Router.configure({
  layoutTemplate: 'layout'
});

getRouteData = function() {
  return {prose: Session.get("selected_prose"), branch: Session.get("selected_branch")};
}

setRouteSubscriptions = function(route, branch_name) {
  route.subscribe("proses").wait();
  route.subscribe("branch_by_url", route.params.url).wait();
  prose = Prose.get(route.params.url);
  sub = Meteor.subscribe("branches_by_url", route.params.url)
  if (branch_name) {
    sub.wait();
  }
  branch = Branch.getByUrl(route.params.url, branch_name);

  route.subscribe("branch_by_url", "__journal_template__");

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
    before: function() {
      setRouteSubscriptions(this, false);
    }
  });

  this.route('branch', {
    path: '/:url/b/:branch_name',
    template: 'prose',
    reactive: false,
    data: getRouteData,
    before: function() {
      setRouteSubscriptions(this, this.params.branch_name);
    }
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
