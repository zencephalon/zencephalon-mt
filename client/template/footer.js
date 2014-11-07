Template.footer.helpers({
  word_count: function() {
    if (count = Counts.get()) {
      return count.word_count;
    }
  },
  prose_count: function() {
    if (count = Counts.get()) {
      return count.prose_count;
    }
  },
  content: function() {
    template = Prose.get("__footer_template__");
    if (template._id && template.getBranch()) {
      return template.getBranch().text;
    }
  }
});