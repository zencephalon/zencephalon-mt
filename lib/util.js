Util = {
  cleanURL : function(url) {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  },
  bulkUpdate : function(collection, query, update) {
    var documentIdentifiers = _.pluck(collection.find(query, { fields: { _id: 1 }}).fetch(), '_id');
    for (var i = 0; i < documentIdentifiers.length; i++)
      collection.update(documentIdentifiers[i], update);
  }
}