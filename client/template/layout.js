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
