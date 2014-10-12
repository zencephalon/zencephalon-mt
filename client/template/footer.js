Template.footer.word_count = function() {
  if (count = Counts.get()) {
    return count.word_count;
  }
}

Template.footer.prose_count = function() {
  if (count = Counts.get()) {
    return count.prose_count;
  }
}

Template.footer.content = function() {
  template = Prose.get("__footer_template__");
  if (template._id && template.getBranch()) {
    return template.getBranch().text;
  }
}