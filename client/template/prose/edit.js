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
    rules: [{
      token: '](',
      collection: Proses,
      field: "url",
      template: Template.prose_url
    }]
  }
}

Template.prose_edit.save_prose = function(new_revision) {
  live_prose = Template.prose_edit.live_prose();
  prose = Template.prose_edit.prose();
  branch = Session.get("selected_branch");

  Session.set("caret_pos", Caret.get(document.getElementById("prose_text")));

  Prose.save(prose, live_prose, branch, new_revision);

  Session.set("view_mode", true);
  if (new_revision) {
    Router.go('prose', {url: live_prose["url"]});
  }
}

Template.prose_edit.events({
  'click input.save': function() {Template.prose_edit.save_prose(true)},
  'click a.edit_toggle': function() {
    Session.set("view_mode", true);
  }
});

Template.prose_edit.rendered = function() {
  Mousetrap.bind('ctrl+s', function(e) { Template.prose_edit.save_prose(true);});
  Mousetrap.bind('ctrl+space', function(e) { Template.prose_edit.save_prose(false);});
  $(document).ready(function() {
    $("#prose_text").focus();
    Caret.set(document.getElementById("prose_text"), Session.get("caret_pos"));
  });
}

