Template.prose_view.prose = Template.prose_edit.prose;

Template.prose_view.events({
  'click h2.title': function() {
    Session.set("view_mode", false);
  }
});

Template.prose_view.branch_text = function() {
  branch = Session.get("selected_branch");
  if (branch !== undefined) {
    if (Meteor.user()) {
      branch.text = EPrimer.showErrors(branch.text);
    }
    return branch.text;
  } else {
    return "Loading...";
  }
}

Template.prose_view.rendered = function() {
  $(document).ready(function() {
  })
}