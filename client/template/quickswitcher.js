Template.quickswitcher.settings = function() {
  return {
    position: "bottom",
    limit: 5,
    rules: [{
      token: ':',
      replacement: '',
      end_token: '',
      collection: _Proses,
      field: "url",
      template: Template.prose_url_title
    }]
  }
}

Template.quickswitcher.events({
  'submit form': function(event) { 
    event.preventDefault();

    if (View.editMode()) {
      //Editor.saveProse(false, false);
    }
    Router.go('prose', {url: $('#switcher').val()});
    View.autosize();
  }
});

Template.quickswitcher.rendered = function() {
  Mousetrap.bind('ctrl+space', function(e) { 
    e.preventDefault();
    $('#quickswitcher').show();

    // Save the viewport
    View.save(e.target);

    $('#switcher').focus().val(":");
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    return false;
  });
  $(document).ready(function() {
    $('#quickswitcher').focusout(function() {
      $('#quickswitcher').hide();
      // Restore the viewport
      View.restore();
    })
  });
}