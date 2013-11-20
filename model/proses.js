Proses = new Meteor.Collection("proses");

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
    saveBranch(prose, text, '0');
  },
  update : function(prose, title, url, text, branch) {
    new_branch_name = createBranch(branch, prose._id, prose.tree, text);
    prose.tree.push(new_branch_name);
    url = cleanURL(url);
    Proses.update(prose._id, {"$set": {branch: new_branch_name, tree: prose.tree, title: title, url: url, updated: new Date()}});
  },
  save : function(prose, live_prose, branch) {
    if (prose._id !== undefined) {
      this.update(prose, live_prose["title"], live_prose["url"], live_prose["text"], branch.name);
    } else {
      this.create(live_prose.title, live_prose.url, live_prose.text)
    }   
  }
}