Template.branch_list.branch_display = function(current_branch, parent_branch_length, prose) {
  branch_names = _.pluck(_Branches.find({prose: prose._id}).fetch(), 'name');
  output = "<table><tr>";
  function branch_url(branch, parent_branch_length) {
    // FIXME: this is bad coupling.
    prose = new Prose(prose);
    return "<a href='/" + prose.url + "/b/" + branch + "'" + (branch === prose.getBranch().name ? "class='active'" : "") + ">" + branch.substr(parent_branch_length) + "</a>";
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
        output += Template.branch_list.branch_display(current_branch + next_lat_code + '0', current_branch.length + next_lat_code.length, prose);
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