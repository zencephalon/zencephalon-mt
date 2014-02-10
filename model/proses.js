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

Prose = {
  get : function(url) {
    var prose = Proses.findOne({url: url});
    if (prose === undefined) {
      return {title: url, url: url}
    } else {
      return prose;
    }
  },
  create : function(title, url, text, journal) {
    branch = '0';
    tree = ['0'];
    url = Util.cleanURL(url);
    prose = Proses.insert({title: title, url: url, branch: branch, tree: tree, journal: journal, updated: new Date()})
    Branch.create(prose, url, text, '0', true);
  },
  change_url : function(prose, url) {
    if (prose.url != url) {
      Proses.update(prose._id, {"$set": {url: url}});
      //Branches.update({prose: prose._id}, {"$set": {title: title}});
      Util.bulkUpdate(Branches, {prose: prose._id}, {"$set": {url: url}});
    }
  },
  update : function(prose, title, url, text, branch, new_branch) {
    url = Util.cleanURL(url);
    if (new_branch) {
      new_branch_name = Branch.save(branch.name, prose._id, prose.tree, text, true);
      prose.tree.push(new_branch_name);
      Proses.update(prose._id, {"$set": {branch: new_branch_name, tree: prose.tree, url: url, updated: new Date()}});
    } else {
      Branch.update(branch._id, prose._id, text);
      Proses.update(prose._id, {"$set": {url: url, updated: new Date()}});
    }
    this.change_url(prose, url);
  },
  save : function(prose, live_prose, branch, new_branch) {
    if (prose._id !== undefined) {
      this.update(prose, live_prose["title"], live_prose["url"], live_prose["text"], branch, new_branch);
    } else {
      this.create(live_prose.title, live_prose.url, live_prose.text, false)
    }   
  }
}