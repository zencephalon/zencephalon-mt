FastRender.route('/z/prose', function(params) {
  this.find(Proses, {journal: {"$ne": true}}, {sort: {updated: -1}});
  this.completeSubscriptions(['proses']);
})