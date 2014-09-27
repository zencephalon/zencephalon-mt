_Branches = new Meteor.Collection("branches");

_Branches.allow({
  update: function() {
    return Permission.allow();
  },
  insert: function() {
    return Permission.allow();
  },
  remove: function() {
    return Permission.allow();
  }
});

Branches = {
  subscriptions : function() {
    Meteor.publish("branch_by_url", function(url) {return _Branches.find({url: url, active: true})});
    Meteor.publish("branches_by_url", function(url) {return _Branches.find({url: url})});
  },
  get : function(prose_id, name) {
    return _Branches.findOne({prose: prose_id, name: name});
  },
  getByUrl : function(url, branch_name) {
    if (branch_name) {
      query = {url: url, name: branch_name};
    } else {
      query = {url: url, active: true};
    }
    return _Branches.findOne(query);
  },
  create : function(prose_id, url, text, name, active) {
    return _Branches.insert({active: active, url: url, prose: prose_id, text: text, name: name, updated: new Date()});
  },
  update : function(branch_id, prose_id, text) {
    this.unsetOthersActive(prose_id);
    _Branches.update(branch_id, {'$set': {text: text, updated: new Date(), active: true}});
  },
  save : function(current_branch, prose_id, tree, text, url, active) {
    new_branch_name = this.get_new_branch_name(current_branch, tree);
    if (active) {
      this.unsetOthersActive(prose_id);
    }
    this.create(prose_id, url, text, new_branch_name, active);
    return new_branch_name;
  },
  unsetOthersActive : function(prose_id) {
      Util.bulkUpdate(_Branches, {prose: prose_id}, {'$set': {active: false}});
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
