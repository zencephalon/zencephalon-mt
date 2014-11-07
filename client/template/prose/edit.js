Template.prose_edit.helpers({
  displayShortCuts: function() {
    return !!Session.get("display_shortcuts");
  },
  displayFormatting: function() {
    return !!Session.get("display_formatting");
  },
  settings: function() {
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
});

Template.prose_edit.rendered = function() {
  $(document).ready(function() {
    Editor.initView();
  });
}