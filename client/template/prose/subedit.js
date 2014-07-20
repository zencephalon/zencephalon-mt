Template.prose_subedit.events({
  'keyup': function(e) {
    var target = $(e.target);

    new_revision = false;
    if (branch !== undefined && branch.updated.getTime() + 60 * 1000 * 10 < new Date().getTime()) {
      new_revision = true;
    }
    
    prose = new Prose(prose);
    prose.save({title: prose.title, text: target.val(), url: prose.url}, branch, new_revision);
  },
  'select, mouseup': function(e) {
    var target = $(e.target);
    console.log(target);
    console.log(target.getSelection());
  }
});