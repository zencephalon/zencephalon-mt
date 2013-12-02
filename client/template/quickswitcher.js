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
    view_mode = Session.get("view_mode");
    if (!view_mode && (view_mode !== undefined)) {
      Template.prose_edit.save_prose(false);
    }
    Router.go('prose', {url: $('.switcher').val()})
  }
});

Template.quickswitcher.rendered = function() {
  Mousetrap.bind('ctrl+space', function(e) { 
    e.preventDefault();
    $('#quickswitcher').show();

    // Save the viewport
    view_mode = Session.get("view_mode");
    if (!view_mode && (view_mode !== undefined)) {
      View.save();
    }

    $('.switcher').focus().val(":");
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  $(document).ready(function() {
    $('#quickswitcher').focusout(function() {
      $('#quickswitcher').hide();
      // Restore the viewport
      view_mode = Session.get("view_mode");
      if (!view_mode && (view_mode !== undefined)) {
        View.restore();
      }
    })
  });
}