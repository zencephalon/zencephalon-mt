_Proses = new Meteor.Collection("proses");

_Proses.allow({
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

Prose.prototype.change_url = function(url) {
  if (this.url != url) {
    _Proses.update(this._id, {"$set": {url: url}});
      Util.bulkUpdate(Branches, {prose: this._id}, {"$set": {url: url}});
    }
}

Prose.prototype.update = function(title, url, text, branch, new_branch) {
    url = Util.cleanURL(url);
    if (new_branch) {
      new_branch_name = Branch.save(branch.name, this._id, this.tree, text, url, true);
      this.tree.push(new_branch_name);
      _Proses.update(this._id, {"$set": {title: title, branch: new_branch_name, tree: this.tree, url: url, updated: new Date()}});
    } else {
      Branch.update(branch._id, this._id, text);
      _Proses.update(this._id, {"$set": {title: title, url: url, updated: new Date()}});
    }
    this.change_url(url);
}
  
Prose.prototype.save = function(live_prose, branch, new_branch) {
    if (this._id !== undefined) {
      this.update(live_prose["title"], live_prose["url"], live_prose["text"], branch, new_branch);
    } else {
      Proses.create(live_prose.title, live_prose.url, live_prose.text, false)
    }   
  }

Proses = {
  get : function(url) {
    var prose = _Proses.findOne({url: url});
    if (prose === undefined) {
      return new Prose({title: url, url: url});
    } else {
      return new Prose(prose);
    }
  },
  create : function(title, url, text, journal) {
    branch = '0';
    tree = ['0'];
    url = Util.cleanURL(url);
    prose = _Proses.insert({title: title, url: url, branch: branch, tree: tree, journal: journal, updated: new Date()})
    Branch.create(prose, url, text, '0', true);
  }

}