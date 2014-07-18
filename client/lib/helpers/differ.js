Differ = {
  diff : function(prose, branch_name, diff_branch_name) {
    if (prose._id !== undefined) {
      branch = prose.getBranch(branch_name);
      branch_diff = prose.getBranch(diff_branch_name);
      dmp = new diff_match_patch();
      d = dmp.diff_main(branch.text, branch_diff.text);
      dmp.diff_cleanupSemantic(d);
      return dmp.diff_prettyHtml(d); 
    }
  }
}