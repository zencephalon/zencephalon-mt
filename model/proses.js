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
  create : function(title, url, text) {
    branch = '0';
    tree = ['0'];
    url = cleanURL(url);
    prose = Proses.insert({title: title, url: url, branch: branch, tree: tree, updated: new Date()})
    Branch.create(prose, text, '0');
  },
  update : function(prose, title, url, text, branch, new_branch) {
    url = cleanURL(url);
    if (new_branch) {
      new_branch_name = Branch.save(branch.name, prose._id, prose.tree, text);
      prose.tree.push(new_branch_name);
      Proses.update(prose._id, {"$set": {branch: new_branch_name, tree: prose.tree, title: title, url: url, updated: new Date()}});
    } else {
      Branch.update(branch._id, prose, text);
      Proses.update(prose._id, {"$set": {title: title, url: url, updated: new Date()}});
    }
  },
  save : function(prose, live_prose, branch, new_branch) {
    if (prose._id !== undefined) {
      this.update(prose, live_prose["title"], live_prose["url"], live_prose["text"], branch, new_branch);
    } else {
      this.create(live_prose.title, live_prose.url, live_prose.text)
    }   
  }
}