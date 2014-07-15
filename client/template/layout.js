Template.layout.rendered = function() {
  Journal.bindKeys();
  $('body').flowtype({
    minimum: 0,
    maximum: 1600,
    minFont: 12,
    maxFont: 42,
    fontRatio: 40,
    lineRatio: 1.45
  });
//$('#content').width($(window).height() * (1 + Math.sqrt(5)) / 2);
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