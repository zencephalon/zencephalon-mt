Router.configure({
  layoutTemplate: 'layout'
});

getRouteData = function(url, branch_name) {
  var prose = Prose.get(url);
  var branch = prose.getBranch(branch_name);
  if (!(prose.journal || prose.private) || Meteor.user()) {
    Session.set("selected_prose", prose);
    Session.set("selected_branch", branch);
    return {prose: prose, branch: branch};
  }
}

waitOnFunction = function() {
  return [Meteor.subscribe("prose_by_url", this.params.url), Meteor.subscribe("branch_by_url", this.params.url), Meteor.subscribe('branches_by_url', this.params.url)];
}

Router.onBeforeAction(function() {
  Meteor.subscribe("branch_by_url", "__journal_template__");
  Meteor.subscribe("branch_by_url", "__footer_template__");
  Meteor.subscribe('counts');
  if (Meteor.user()) {
    Meteor.subscribe("proses");
    Meteor.subscribe("prose_by_url", "todo");
    Meteor.subscribe("branches_by_url", "todo");
  } else {
    Meteor.subscribe("proses_public");
  }
});

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
    data: function() {
      return {proses: Proses.find({journal: {"$ne": true}}, {sort: {updated: -1}})};
    }
  });

  this.route('journal_list', {
    path: '/z/journal',
    template: 'list_proses',
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
    //template: 'prose',
    waitOn: waitOnFunction,
    data: function() {
      // if (this.params.url.slice(-1) === "!") {
      //   this.params.url = this.params.url.slice(0, -1);
      // }
      // console.log(this.params.url);
      return getRouteData(this.params.url, undefined);
    },
    action: function() {
      if (this.ready()) {
        this.render('prose');
      } else {
        this.render('loading');
      }
    },
    onAfterAction: function() {
      document.title = this.data()['prose']['title'];
    }
  });

  this.route('branch', {
    path: '/:url/b/:branch_name',
    template: 'prose',
    waitOn: waitOnFunction,
    data: function() {
      return getRouteData(this.params.url, this.params.branch_name);
    },
  });

  this.route('diff', {
    path: '/:url/b/:branch_name/:diff_branch_name',
    template: 'diff',
    waitOn: waitOnFunction,
    data: function() {
      prose = Prose.get(this.params.url);
      branch_name = this.params.branch_name;
      diff_branch_name = this.params.diff_branch_name;
      return {prose: prose, diff: Differ.diff(prose, branch_name, diff_branch_name)};
    }
  })
});
