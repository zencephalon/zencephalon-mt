Template.prose_subedit.events({
  'keypress': function(e) {
    var target = $(e.target);

    var timer = Session.get("autosave_timer");
    target.removeClass("saved");

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    Session.set("autosave_timer", setTimeout(function() {
      target.addClass("saved");
      Editor.saveProse(e.target);
    }, 700));
  },
  'select, mouseup, keyup': function(e) {
    var target = $(e.target);
    var selection = target.getSelection();
    if (selection !== undefined) {
      Meteor.subscribe("branches_by_url", selection.text);
    }
  }
});

Template.prose_subedit.rendered = function() {
  $(document).ready(function() {
    $("textarea").autosize();
    View.autosize();
  });
}