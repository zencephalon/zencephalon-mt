Branches = new Meteor.Collection("branches");

Branch = {
  get : function(prose_id, name) {
    var branch = Branches.findOne({prose: prose_id, name: name});
    return branch;
  },
  create : function(prose_id, text, name) {
    return Branches.insert({prose: prose_id, text: text, name: name, updated: new Date()});
  },
  update : function(branch_id, prose_id, text) {
    Branches.update(branch_id, {'$set': {text: text, updated: new Date()}});
  },
  save : function(current_branch, prose, tree, text) {
    new_branch_name = this.get_new_branch_name(current_branch, tree);
    this.create(prose, text, new_branch_name);
    return new_branch_name;
  },
  digits : function(branch) {
    return /\d+$/.exec(branch)[0];
  }, 
  next_sequential_branch : function(branch) {
    dig = this.digits(branch);
    next = parseInt(dig) + 1;
    return branch.substr(0, branch.length - dig.length) + next
  },
  next_lateral_code : function(code) {
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
  },
  get_new_branch_name : function(current_branch, tree) {
    if (current_branch === null) {
      saveBranch(prose, text, '0');
      return '0';
    } else {
      next_seq_branch = this.next_sequential_branch(current_branch);

      if (tree.indexOf(next_seq_branch) === -1) {
        return next_seq_branch;
      } else {
        next_lat_code = 'a';
        while (tree.indexOf(current_branch + next_lat_code + '0') !== -1) {
          next_lat_code = this.next_lateral_code(next_lat_code);
        }
        new_branch_name = current_branch + next_lat_code + '0';
        return new_branch_name;
      }
    } 
  }
}