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
  'click a.formatting_toggle': function() {
    Session.set('display_formatting', !Session.get('display_formatting'));
  },
  'click a.shortcuts_toggle': function() {
    Session.set('display_shortcuts', !Session.get('display_shortcuts'));
  }
});

Template.prose_edit.rendered = function() {
  $(document).ready(function() {
    Editor.initView();
  });
}