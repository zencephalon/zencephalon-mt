Template.footer.word_count = function() {
  var count = Counts.get();
  if (count !== undefined) {
    return count.word_count;
  }
}

Template.footer.prose_count = function() {
  var count = Counts.get();
  if (count !== undefined) {
    return count.prose_count;
  }
}

Template.footer.content = function() {
  template = Proses.get("__footer_template__");
  if (template._id !== undefined) {
    return Branches.get(template._id, template.branch).text
  }
}