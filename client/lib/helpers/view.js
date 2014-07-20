View = {
  proseArea : function() { return document.getElementById("prose_text")},
  save : function(prose_area) {
    prose_area_jq = $(prose_area);
    if (View.editMode()) {
      view_id = prose_area_jq.attr("data-prose");
      old_view = Session.get("saved_view");
      view = {caret_pos: Caret.get(prose_area), scroll_pos: prose_area.scrollTop, window_pos: document.body.scrollTop};

      if (old_view !== undefined) {
        old_view[view_id] = view;
      } else {
        old_view = {};
        old_view[view_id] = view;
      }

      Session.set("saved_view", old_view);
      Session.set("current_view", view_id);
    }
  },
  restore : function() {
    if (View.editMode()) {
      view_id = Session.get("current_view");
      if (view_id !== undefined) {
        prose_area = $("[data-prose='" + view_id + "']").get(0);
        prose_area.focus();
        view = Session.get("saved_view");

        if (view !== undefined && (view = view[view_id]) !== undefined) {
          Caret.set(prose_area, view.caret_pos);
          prose_area.scrollTop = view.scroll_pos;
          document.body.scrollTop = document.documentElement.scrollTop = view.window_pos;
        }
      }
    } else {
      //document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  },
  getCaret : function(prose_area) {
    view_id = $(prose_area).attr("data-prose");
    view = Session.get("saved_view");
    if (view !== undefined && (view = view[view_id]) !== undefined) {
      return view.caret_pos;
    }
  },
  setCaret : function(caret_pos, target) {
    Caret.set(target, caret_pos);
  },
  editMode : function() {
    view_mode = Session.get("view_mode");
    return ((!view_mode || (view_mode === undefined)) && (Session.get("selected_branch") !== undefined) && !!Meteor.user());
  },
  cursorScroll : function(prose_area) {
    helper = document.getElementById('text-height-helper').firstChild;
    cursor_pos = Caret.get(prose_area);
    helper.innerHTML = prose_area.value.substr(0, cursor_pos).replace(/\n$/,"\n\001");
    rects = document.getElementById('text-height-helper').getClientRects();
    lastRect = rects[rects.length - 1];

    document.body.scrollTop = document.documentElement.scrollTop = $(prose_area).position().top + lastRect.height - 200;
  }
}