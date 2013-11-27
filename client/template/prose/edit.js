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

Template.prose_edit.displayShortCuts = function() {
  return !!Session.get("display_shortcuts");
}

Template.prose_edit.displayFormatting = function() {
  return !!Session.get("display_formatting");
}

Template.prose_edit.settings = function() {
  return {
    position: "bottom",
    limit: 5,
    rules: [{
      token: '\\]\\(',
      replacement: '](',
      end_token: ')',
      collection: Proses,
      field: "url",
      template: Template.prose_url_title
    }]
  }
}

Template.prose_edit.save_prose = function(new_revision) {
  live_prose = Template.prose_edit.live_prose();
  prose = Template.prose_edit.prose();
  branch = Session.get("selected_branch");
  prose_area = document.getElementById("prose_text");
  Session.set("caret_pos", Caret.get(prose_area));
  Session.set("scroll_pos", prose_area.scrollTop);

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
  },
  'click a.formatting_toggle': function() {
    Session.set('display_formatting', !Session.get('display_formatting'));
  },
  'click a.shortcuts_toggle': function() {
    Session.set('display_shortcuts', !Session.get('display_shortcuts'));
  }
});

Template.prose_edit.rendered = function() {
  Mousetrap.bind('ctrl+shift+s', function(e) { Template.prose_edit.save_prose(true);});
  Mousetrap.bind('ctrl+s', function(e) { Template.prose_edit.save_prose(false);});
  $(document).ready(function() {
    if (Session.get("just_loaded")) {
      $("#prose_text").focus();
      prose_area = document.getElementById("prose_text");
      Caret.set(prose_area, Session.get("caret_pos"));
      prose_area.scrollTop = Session.get("scroll_pos");
      Session.set("just_loaded", false);
    }
  });
}