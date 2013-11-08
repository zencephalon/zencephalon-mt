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
  branch = Branches.insert({text: text});
  tree = {};
  tree[branch] = {};
  Proses.insert({title: title, url: url, branch: branch, tree: tree})
}

saveProse = function(prose, live_prose) {
  if (prose._id !== undefined) {
    ["title", "text", "url"].forEach(function(ele) {
      prose[ele] = live_prose[ele];
    });
    Proses.update(prose['_id'], prose);
  } else {
    Proses.insert(live_prose);
  }
}