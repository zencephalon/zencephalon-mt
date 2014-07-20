Template.prose_subedit.events({
  'keyup': function(e) {
    console.log(this);
    var target = $(e.target);
    var branch = this.branch;
    var prose = this.prose;
    //var prose = Proses.get(this.branch.url)
    console.log(prose);
    console.log(branch);
    // console.log(Template.prose_subedit.prose);
    // console.log(Template.prose_subedit.branch);

    new_revision = false;
    if (branch !== undefined && branch.updated.getTime() + 60 * 1000 * 10 < new Date().getTime()) {
      new_revision = true;
    }
    
    //prose = new Prose(prose);
    prose.save({title: prose.title, text: target.val(), url: prose.url}, branch, new_revision);
  },
  'select, mouseup': function(e) {
    var target = $(e.target);
    console.log(target);
    console.log(target.getSelection());
    Meteor.subscribe("branch_by_url", target.getSelection().text);
  }
});