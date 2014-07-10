_Counts = new Meteor.Collection("counts");

Counts = {
  get : function() {
    return _Counts.findOne({}, {sort: {time: -1}});
  },
  _publication_single : function() {
    return _Counts.find({},{sort: {time: -1}, limit: 1});
  }
}