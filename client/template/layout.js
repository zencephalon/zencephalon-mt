Template.layout.rendered = function() {
  Journal.bindKeys();
  $('body').flowtype({
    minimum: 0,
    maximum: 1600,
    minFont: 12,
    maxFont: 42,
    fontRatio: 30,
    lineRatio: 1.45
  });
}

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