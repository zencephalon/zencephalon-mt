Template.prose_subedit.events({
  'keyup': function(e) {
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
  'select, mouseup': function(e) {
    var target = $(e.target);
    var selection = target.getSelection();
    if (selection !== undefined) {
      Meteor.subscribe("branch_by_url", target.getSelection().text);
    }
  }
});

Template.prose_subedit.rendered = function() {
  $(document).ready(function() {
    $("textarea").autosize();
    setTimeout(function(){$("textarea").trigger('autosize.resize')}, 1000);
  });
}