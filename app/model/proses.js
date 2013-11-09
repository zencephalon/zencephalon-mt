Proses = new Meteor.Collection("proses");

getProse = function(url) {
  var prose = Proses.findOne({url: url});
  if (prose === undefined) {
    return {title: url, url: url}
  } else {
    return prose;
  }
}

createProse = function(title, url, text) {
  branch = '0';
  tree = ['0'];
  url = cleanURL(url);
  prose = Proses.insert({title: title, url: url, branch: branch, tree: tree})
  saveBranch(prose, text, '0');
}

updateProse = function(prose, title, url, text) {
  new_branch_name = createBranch(prose.branch, prose._id, prose.tree, text);
  prose.tree.push(new_branch_name);
  url = cleanURL(url);
  Proses.update(prose._id, {"$set": {branch: new_branch_name, tree: prose.tree, title: title, url: url}});
}

saveProse = function(prose, live_prose) {
  if (prose._id !== undefined) {
    updateProse(prose, live_prose["title"], live_prose["url"], live_prose["text"]);
  } else {
    createProse(live_prose.title, live_prose.url, live_prose.text)
  }
}