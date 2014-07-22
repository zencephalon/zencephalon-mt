Template.prose_subedit.events({
  'keyup': function(e) {
    var target = $(e.target);
    var branch = this.branch;
    var prose = this.prose;

    var timer = Session.get("autosave_timer");

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    Session.set("autosave_timer", setTimeout(function() {
      console.log("Saved");
      new_revision = false;
      if (branch !== undefined && branch.updated.getTime() + 60 * 1000 * 10 < new Date().getTime()) {
        new_revision = true;
      }
      
      prose.save({title: prose.title, text: target.val(), url: prose.url}, branch, new_revision);
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