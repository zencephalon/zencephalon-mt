Branches = new Meteor.Collection("branches");

getBranch = function(prose, name) {
  var branch = Branches.findOne({prose: prose, name: name});
  return branch;
}

saveBranch = function(prose, text, name) {
  return Branches.insert({prose: prose, text: text, name: name});
}

createBranch = function(current_branch, prose, tree, text) {
  digits = function(branch) {
    return /\d+$/.exec(branch)[0];
  }

  next_sequential_branch = function(branch) {
    dig = digits(branch);
    next = parseInt(dig) + 1;
    return branch.substr(0, branch.length - dig.length) + next
  }

  next_lateral_code = function(code) {
    arr_len = code.length;
    arr = code.split('');
    add_new = false;
    for (i = (arr_len - 1); i >= 0; i--) {
      if (arr[i] !== 'z') {
        arr[i] = String.fromCharCode(arr[i].charCodeAt(0) + 1);
        break;
      } else {
        arr[i] = 'a';
        if (i === 0) {
          add_new = true;
        }
      }
    }
    new_code = arr.join('');
    if (add_new) {
      new_code = 'a' + new_code;
    }
    return new_code;
  }

  if (current_branch === null) {
    return "0";
  } else {
    next_seq_branch = next_sequential_branch(current_branch);
    if (tree.indexOf(next_seq_branch) !== -1) {
      next_lat_code = 'a';
      while (tree.indexOf(current_branch + next_lat_code + '0') !== -1) {
        next_lat_code = next_lateral_code(next_lat_code);
      }
      saveBranch(prose, text, current_branch + next_lat_code + '0');
    } else {
      saveBranch(prose, text, next_seq_branch);
    }
  }
}