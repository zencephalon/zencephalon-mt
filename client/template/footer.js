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