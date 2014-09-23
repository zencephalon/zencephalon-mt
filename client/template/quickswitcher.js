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
      template: Template.prose_url_title,
      callback: function(doc, element) {
        Router.go('prose', {url: $('#switcher').val()});
        $('#quickswitcher').hide();
        View.autosize();
        View.restore_delayed($('#switcher').val());
      }
    }]
  }
}

Template.quickswitcher.events({    
  'submit form': function(event) {     
    event.preventDefault();    
   
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
      View.restore_delayed();
    })
  });
}