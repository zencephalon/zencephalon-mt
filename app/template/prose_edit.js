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

  saveProse = function(prose, live_prose) {
    if (prose._id !== undefined) {
        ["title", "text", "url"].forEach(function(ele) {
          prose[ele] = live_prose[ele];
        });
        Proses.update(prose['_id'], prose);
      } else {
        Proses.insert(live_prose);
      }
  }

  Template.prose_edit.events({
    'click input.save': function() {
      var live_prose = Template.prose_edit.live_prose();
      var prose = Template.prose_edit.prose();

      saveProse(prose, live_prose);

      Session.set("view_mode", true);
      Router.go('prose', {url: live_prose["url"]});
    }
  });
}