Differ = {
  diff : function(prose, branch_name, diff_branch_name) {
    if (prose !== undefined) {
      branch = Branch.get(prose._id, branch_name);
      branch_diff = Branch.get(prose._id, diff_branch_name);
    }
    dmp = new diff_match_patch();
    d = dmp.diff_main(branch.text, branch_diff.text);
    dmp.diff_cleanupSemantic(d);
    return dmp.diff_prettyHtml(d); 
  }
}