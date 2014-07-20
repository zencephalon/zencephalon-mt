Template.prose_subedit.events({
  'keyup': function(e) {
    var target = $(e.target);
    var branch = this.branch;
    var prose = this.prose;

    new_revision = false;
    if (branch !== undefined && branch.updated.getTime() + 60 * 1000 * 10 < new Date().getTime()) {
      new_revision = true;
    }
    
    prose.save({title: prose.title, text: target.val(), url: prose.url}, branch, new_revision);
  },
  'select, mouseup': function(e) {
    var target = $(e.target);
    Meteor.subscribe("branch_by_url", target.getSelection().text);
  }
});

Template.prose_subedit.rendered = function() {
  $(document).ready(function() {
    $("textarea").autosize();
  });
}