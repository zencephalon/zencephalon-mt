Template.textarea.settings = function() {
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

// Template.textarea.rendered = function() {
//   setTimeout(function(){$('textarea').val(this.data.text)}, 500);
  
// }