Proses = new Meteor.Collection("proses");

Proses.allow({
  update: function() {
    return Permission.allow();
  },
  insert: function() {
    return Permission.allow();
  },
  remove: function() {
    return Permission.allow();
  }
});

Prose = function (o) {
  for (p in o) {
    this[p] = o[p]
  }
}

Prose.subscriptions = function() {
  Meteor.publish("proses", function() { return Proses.find(); });
  Meteor.publish("proses_public", function() { return Proses.find({journal: {'$ne': true}, private: {'$ne': true}})});
  Meteor.publish("prose_by_url", function(url) {return Proses.find({url: url})});
}

Prose.prototype.change_url = function(url) {
  if (this.url != url) {
    Proses.update(this._id, {"$set": {url: url}});
      Util.bulkUpdate(_Branches, {prose: this._id}, {"$set": {url: url}});
    }
}

Prose.prototype.update = function(prose, branch, new_branch) {
    url = Util.cleanURL(prose['url']);
    if (new_branch) {
      new_branch_name = Branches.save(branch.name, this._id, this.tree, prose['text'], url, true);
      this.tree.push(new_branch_name);
      Proses.update(this._id, {"$set": {title: prose['title'], branch: new_branch_name, tree: this.tree, url: url, updated: new Date()}});
    } else {
      Branches.update(branch._id, this._id, prose['text']);
      Proses.update(this._id, {"$set": {title: prose['title'], url: url, updated: new Date()}});
    }
    this.change_url(url);
}
  
Prose.prototype.save = function(live_prose, branch, new_branch) {
  if (this._id) {
    this.update(live_prose, branch, new_branch);
  } else {
    Prose.create(live_prose.title, live_prose.url, live_prose.text, false)
  }   
}

Prose.prototype.getBranch = function(branch_name) {
  if (branch_name) {
    return Branches.get(this._id, branch_name);
  } else {
    return Branches.get(this._id, this.branch);
  }
}

Prose.prototype.togglePrivate = function() {
  Proses.update(this._id, {"$set": {private: !this.private}});
}

Prose.get = function(url) {
  var prose = Proses.findOne({url: url});
  if (prose === undefined) {
    return new Prose({title: url, url: url});
  } else {
    return new Prose(prose);
  }
}

Prose.create = function(title, url, text, journal) {
  branch = '0';
  tree = ['0'];
  url = Util.cleanURL(url);
  prose = Proses.insert({title: title, url: url, branch: branch, tree: tree, journal: journal, updated: new Date()})
  Branches.create(prose, url, text, '0', true);
}

