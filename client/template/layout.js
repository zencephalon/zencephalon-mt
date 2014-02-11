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
  return Counts.findOne({}, {sort: {_id:1}}).word_count;
}

Template.footer.prose_count = function() {
  return Counts.findOne({}, {sort: {_id:1}}).prose_count;
}