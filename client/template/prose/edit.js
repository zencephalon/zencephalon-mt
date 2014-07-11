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
      collection: _Proses,
      field: "url",
      template: Template.prose_url_title
    }]
  }
}

Template.prose_edit.events({
  'click a.save': function() {
    Editor.saveProse(true, true)
  },
  'click a.edit_toggle': function() {
    Editor.saveProse(false, true);
  },
  'click a.formatting_toggle': function() {
    Session.set('display_formatting', !Session.get('display_formatting'));
  },
  'click a.shortcuts_toggle': function() {
    Session.set('display_shortcuts', !Session.get('display_shortcuts'));
  }
});


Template.prose_edit.created = function() {
}

Template.prose_edit.destroyed = function() {
  Editor.unbindKeys();
}

Template.prose_edit.rendered = function() {
  $(document).ready(function() {
    Editor.initView();
  });
}