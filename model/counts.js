_Counts = new Meteor.Collection("counts");

Counts = {
  get : function() {
    return _Counts.findOne({}, {sort: {time: -1}});
  },
  _publication_single : function() {
    return _Counts.find({},{sort: {time: -1}, limit: 1});
  },
  doCount : function() {
    var words = 0;
    var proses = 0;
    Proses.find().forEach(function (prose) {
      prose = new Prose(prose);
      branch = prose.getBranch();
      words += branch.text.split(' ').length;
      proses++;
    });
    _Counts.insert({prose_count: proses, word_count: words, time: new Date()});
  }
}