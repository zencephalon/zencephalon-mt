Differ = {
  diff : function(prose, branch_name, diff_branch_name) {
    if (prose._id !== undefined) {
      branch = Branches.get(prose._id, branch_name);
      branch_diff = Branches.get(prose._id, diff_branch_name);
      dmp = new diff_match_patch();
      d = dmp.diff_main(branch.text, branch_diff.text);
      dmp.diff_cleanupSemantic(d);
      return dmp.diff_prettyHtml(d); 
    }
  }
}