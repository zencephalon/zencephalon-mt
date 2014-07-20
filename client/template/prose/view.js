Template.prose_view.prose = Template.prose_edit.prose;

Template.prose_view.events({
  'click h1.title': function() {
    Session.set("view_mode", false);
  },
  'mouseover a': function(e) {
    var target = $(e.target);
    var href = target.attr('href');
    if (href.substr(0, 4) !== 'http') {
      Meteor.subscribe("prose_by_url", href);
      Meteor.subscribe("branch_by_url", href);
    }
  },
  'click a': function(e) {
    e.preventDefault();
    var target = $(e.target);
    var href = target.attr('href');
    if (href.substr(0, 4) !== 'http') {
      console.log(href);
      console.log(e.target.parentNode);
      UI.insert(UI.renderWithData(Template.prose_subview, {branch_text: Proses.get(href).getBranch().text}), e.target.parentNode, e.target.nextSibling)
    }
  }
});

Template.prose_view.branch_text = function() {
  branch = Session.get("selected_branch");
  if (branch !== undefined) {
    if (Meteor.user()) {
      branch.text = EPrimer.showErrors(branch.text);
      branch.text = Lover.showLove(branch.text);
    }
    return branch.text;
  } else {
    return "Loading...";
  }
}

Template.prose_view.rendered = function() {
  $(document).ready(function() {
    View.restore();
  })
}