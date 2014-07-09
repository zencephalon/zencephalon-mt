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

ProseObj = function (pojo) {
  for (property in pojo) {
    this[property] = pojo[property]
  }
  this.change_url = func
}

ProseObj.prototype.change_url = function(url) {
  if (this.url != url) {
    Proses.update(this._id, {"$set": {url: url}});
      Util.bulkUpdate(Branches, {prose: this._id}, {"$set": {url: url}});
    }
}

ProseObj.prototype.update = function(title, url, text, branch, new_branch) {
    url = Util.cleanURL(url);
    if (new_branch) {
      new_branch_name = Branch.save(branch.name, this._id, this.tree, text, url, true);
      this.tree.push(new_branch_name);
      Proses.update(this._id, {"$set": {branch: new_branch_name, tree: this.tree, url: url, updated: new Date()}});
    } else {
      Branch.update(branch._id, this._id, text);
      Proses.update(this._id, {"$set": {url: url, updated: new Date()}});
    }
    this.change_url(url);
}

Prose = {
  get : function(url) {
    var prose = Proses.findOne({url: url});
    if (prose === undefined) {
      return new ProseObj({title: url, url: url});
    } else {
      return new ProseObj(prose);
    }
  },
  create : function(title, url, text, journal) {
    branch = '0';
    tree = ['0'];
    url = Util.cleanURL(url);
    prose = Proses.insert({title: title, url: url, branch: branch, tree: tree, journal: journal, updated: new Date()})
    Branch.create(prose, url, text, '0', true);
  },
  save : function(prose, live_prose, branch, new_branch) {
    if (prose._id !== undefined) {
      this.update(prose, live_prose["title"], live_prose["url"], live_prose["text"], branch, new_branch);
    } else {
      this.create(live_prose.title, live_prose.url, live_prose.text, false)
    }   
  }
}