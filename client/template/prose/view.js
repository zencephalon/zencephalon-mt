Template.prose_view.events({
  'click h1.title': function() {
    View.setViewMode(this.prose.url, false);
  },
  'keyup': function(e) {
    $(event.target).change();
  },
  'change': function(e) {
    var $t = $(e.target);
    console.log($t.html());
    // var prose = Prose.id($t.data('id'));
    // console.log(prose);
    console.log($t.contents());
    var c = $t.contents().filter(function() {
      return !$(this).hasClass('subview');
    });
    console.log(c);
    c = $.map(c, function(node) {return (node.nodeType == 3) ? node.data : node.outerHTML}).join("");
    console.log(c);
    this.prose.save({url: this.prose.url, text: c, title: this.prose.title}, this.branch, false);
  },
  'mouseover a': function(e) {
    var target = $(e.target);
    var href = target.attr('href');
    
    if (href.substr(0, 4) !== 'http') {
      if (href.slice(-1) === "!") {
        href = href.slice(0, -1);
      }
      Meteor.subscribe("prose_by_url", href);
      Meteor.subscribe("branch_by_url", href);
    }
  },
  'click a': function(e) {
    var target = $(e.target);
    var href = target.attr('href');
    console.log("Got click!")

    if (href.substr(0, 4) !== 'http') {
      e.preventDefault();
      console.log("Default prevented!")
      var prose = Prose.get(href);
      var branch = prose.getBranch();
      var subview_node = $("[data-url='" + branch.url + "']");

      if (subview_node.length === 0) {
        target.attr('class', 'open-link');
        UI.renderWithData(Template.prose_view, {branch: branch, prose: prose}, e.target.parentNode, e.target.nextSibling);
      } else {
        target.attr('class', '');
        subview_node.remove();
      }
    }
  }
});

Template.prose_view.helpers({
  branch_text: function() {
    branch = this.branch;
    if (branch === undefined) {
      branch = this.prose.getBranch();
    }
    if (branch) {
      text = branch.text;
      if (Meteor.user()) {
        text = EPrimer.showErrors(text);
        text = Lover.showLove(text);
      }
      return text;
    }
  }
});

Template.prose_view.rendered = function() {
  console.log(this);
  $('div[data-id=' + this.data.prose._id + ']').html(this.data.branch.text);
  console.log(this.data.branch.text);
  console.log($('div[data-id=' + this.data.prose._id + ']'));
}