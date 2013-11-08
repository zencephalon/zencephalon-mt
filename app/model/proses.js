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
  prose = Proses.insert({title: title, url: url, branch: branch, tree: tree})
  saveBranch(prose, text, '0');
}

updateProse = function(prose, title, url, text) {
  branch = Branches.insert({text: text});
  parent_branch = prose.branch;
  prose.branch = branch;
}

saveProse = function(prose, live_prose) {
  if (prose._id !== undefined) {
    ["title", "text", "url"].forEach(function(ele) {
      prose[ele] = live_prose[ele];
    });
    Proses.update(prose['_id'], prose);
  } else {
    createProse(live_prose.title, live_prose.url, live_prose.text)
  }
}