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
      live_prose = Template.prose_edit.live_prose();
      prose = Template.prose_edit.prose();
      branch = Session.get("selected_branch");

      saveProse(prose, live_prose, branch);

      Session.set("view_mode", true);
      Router.go('prose', {url: live_prose["url"]});
    },
    'click a.edit_toggle': function() {
      Session.set("view_mode", true);
    }
  });
}