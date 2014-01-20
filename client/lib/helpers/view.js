View = {
  proseArea : function() { return document.getElementById("prose_text")},
  save : function() {
    if (View.editMode()) {
      prose_area = this.proseArea();
      view_id = Session.get("selected_prose").url;
      old_view = Session.get("saved_view");
      view = {caret_pos: Caret.get(prose_area), scroll_pos: prose_area.scrollTop, window_pos: document.body.scrollTop};

      if (old_view !== undefined) {
        old_view[view_id] = view;
      } else {
        old_view = {};
        old_view[view_id] = view;
      }

      Session.set("saved_view", old_view);
    }
  },
  restore : function() {
    if (View.editMode()) {
      prose_area = this.proseArea();
      prose_area.focus();
      view_id = Session.get("selected_prose").url;
      view = Session.get("saved_view");

      if (view !== undefined && (view = view[view_id]) !== undefined) {
        Caret.set(prose_area, view.caret_pos);
        prose_area.scrollTop = view.scroll_pos;
        document.body.scrollTop = document.documentElement.scrollTop = view.window_pos;
      }
    }
  },
  getCaret : function() {
    view_id = Session.get("selected_prose").url;
    view = Session.get("saved_view");
    if (view !== undefined && (view = view[view_id]) !== undefined) {
      return view.caret_pos;
    }
  }
  setCaret : function(caret_pos) {
    Caret.set(this.proseArea(), caret_pos);
  },
  editMode : function() {
    view_mode = Session.get("view_mode");
    return (!view_mode || (view_mode === undefined))
  },
  cursorScroll : function() {
    prose_area = this.proseArea();
    helper = document.getElementById('text-height-helper').firstChild;
    cursor_pos = Caret.get(prose_area);
    helper.innerHTML = prose_area.value.substr(0, cursor_pos).replace(/\n$/,"\n\001");
    rects = document.getElementById('text-height-helper').getClientRects();
    lastRect = rects[rects.length - 1];

    document.body.scrollTop = document.documentElement.scrollTop = $('#prose_text').position().top + lastRect.height - 200;
  }
}