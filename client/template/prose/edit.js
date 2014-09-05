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

Template.prose_edit.rendered = function() {
  $(document).ready(function() {
    Editor.initView();
  });
}