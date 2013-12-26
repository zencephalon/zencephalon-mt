Template.prose_view.prose = Template.prose_edit.prose;

Template.prose_view.events({
  'click h2.title': function() {
    Session.set("view_mode", false);
  }
});

Template.prose_view.branch_text = function() {
  function hiliter(word, input) {
    var rgxp = new RegExp("\\b" + word + "\\b", 'ig');
    var repl = '<span class="standout">' + word + '</span>';
    return input.replace(rgxp, repl);
  };
  branch = Session.get("selected_branch");
  if (branch !== undefined) {
    _.each(["be", "being", "been", "am", "is", "isn't", "are", "aren't", "was", "wasn't", "were", "weren't", "I'm", "you're", "we're", "they're", "he's", "she's", "it's", "there's", "here's", "where's", "how's", "what's", "who's", "that's"], 
      function(word) {
        branch.text = hiliter(word, branch.text);
    });
    return branch.text;
  } else {
    return "Loading...";
  }
}

Template.prose_view.rendered = function() {
  $(document).ready(function() {
  })
}