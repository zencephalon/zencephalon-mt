Template.quickswitcher.settings = function() {
  return {
    position: "bottom",
    limit: 5,
    rules: [{
      token: ':',
      replacement: '',
      end_token: '',
      collection: Proses,
      field: "url",
      template: Template.prose_url_title
    }]
  }
}

Template.quickswitcher.events({
  'submit form': function(event) { 
    event.preventDefault();
    if (!Session.get("view_mode")) {
      Template.prose_edit.save_prose(false);
    }
    Router.go('prose', {url: $('.switcher').val()})
  }
});

Template.quickswitcher.rendered = function() {
  Mousetrap.bind('ctrl+space', function(e) { 
    e.preventDefault();
    $('#quickswitcher').show();
    $('.switcher').focus().val(":");
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  $(document).ready(function() {
  });
}