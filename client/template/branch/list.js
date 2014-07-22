Template.branch_list.branch_display = function(current_branch, parent_branch_length) {
  prose = Session.get("selected_prose");
  branch_names = _.pluck(_Branches.find({prose: prose._id}).fetch(), 'name');
  output = "<table><tr>";
  function branch_url(branch, parent_branch_length) {
    // FIXME: this is bad coupling.
    return "<a href='/" + prose.url + "/b/" + branch + "'>" + branch.substr(parent_branch_length) + "</a>";
  }
  while (_.contains(branch_names, current_branch)) {
    output += "<td>";

    if (_.contains(branch_names, current_branch + 'a0')) {
      output += "<table><tr><td>";
      output += branch_url(current_branch, parent_branch_length);
      output += "</td></tr>";

      next_lat_code = 'a';
      while (_.contains(branch_names, current_branch + next_lat_code + '0')) {
        output += "<tr><td>";
        output += Template.branch_list.branch_display(current_branch + next_lat_code + '0', parent_branch_length + next_lat_code.length + 1);
        output += "</td></tr>";
        next_lat_code = Branches.next_lateral_code(next_lat_code);
      }
      output += "</table>";
    } else {
      output += branch_url(current_branch, parent_branch_length);
    }

    output += "</td>";
    current_branch = Branches.next_sequential_branch(current_branch);
  }
  output += "</tr></table>";
  return output;
}