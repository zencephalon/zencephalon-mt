Template.prose_edit.live_prose = function() {
  var o = {};
  ["title", "text", "url"].forEach(function(ele) {
    o[ele] = $("#prose_" + ele).val();
  });
  return o;
}

Template.prose_edit.prose = function() {
  return Deps.nonreactive(function() { return Session.get("selected_prose");});
}

Template.prose_edit.displayShortCuts = function() {
  return !!Session.get("display_shortcuts");
}

Template.prose_edit.displayFormatting = function() {
  return !!Session.get("display_formatting");
}

Template.prose_edit.settings = function() {
  return {
    position: "bottom",
    limit: 5,
    rules: [{
      token: '\\]\\(',
      replacement: '](',
      end_token: ')',
      collection: Proses,
      field: "url",
      template: Template.prose_url_title
    }]
  }
}

Template.prose_edit.events({
  'click a.save': function() {
    Editor.saveProse(true, true)
  },
  'click a.edit_toggle': function() {
    Editor.saveProse(false, true);
  },
  'click a.formatting_toggle': function() {
    Session.set('display_formatting', !Session.get('display_formatting'));
  },
  'click a.shortcuts_toggle': function() {
    Session.set('display_shortcuts', !Session.get('display_shortcuts'));
  }
});

//var autosaveInterval;

Template.prose_edit.created = function() {
  //autosaveInterval = Meteor.setInterval(function() {Template.prose_edit.save_prose(false, false)}, 5000);
}

Template.prose_edit.destroyed = function() {
  //Meteor.clearInterval(autosaveInterval);
  Mousetrap.unbind('ctrl+shift+s');
  Mousetrap.unbind('ctrl+s');
  Mousetrap.unbind('ctrl+d');
}

Template.prose_edit.rendered = function() {
  $(document).ready(function() {
    Mousetrap.bind('ctrl+shift+s', function(e) { Editor.saveProse(true, true); return false; });
    Mousetrap.bind('ctrl+s', function(e) { Editor.saveProse(false, true); return false; });
    Mousetrap.bind('ctrl+d', Editor.insertTimestamp);
    if (Session.get("just_loaded")) {
      // Restore the viewport
      $("#prose_text").autosize();
      View.restore();

      Session.set("just_loaded", false);
    }
  });
}