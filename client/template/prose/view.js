Template.prose_view.events({
  'click h1.title': function() {
    View.setViewMode(this.prose.url, false);
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

    if (href.substr(0, 4) !== 'http') {
      e.preventDefault();
      
      if (href.slice(-1) === "!") {
        var branch = Prose.get(href.slice(0, -1)).getBranch();
        var subview_node = $("[data-url='" + branch.url + "']");

        if (subview_node.length === 0) {
          target.attr('class', 'open-link');
          UI.renderWithData(Template.prose_subview, {branch: branch}, e.target.parentNode, e.target.nextSibling);
        } else {
          target.attr('class', '');
          subview_node.remove();
        }
      } else {
        Router.go('prose', {url: href});
      }
    }
  }
});

Template.prose_view.branch_text = function() {
  branch = this.branch;
  if (branch === undefined) {
    branch = this.prose.getBranch();
  }
  if (branch !== undefined) {
    text = branch.text;
    if (Meteor.user()) {
      text = EPrimer.showErrors(text);
      text = Lover.showLove(text);
    }
    return text;
  }
}

Template.prose_view.rendered = function() {
  $(document).ready(function(){
    setTimeout(function() {
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      })
    }, 400);
  })
}