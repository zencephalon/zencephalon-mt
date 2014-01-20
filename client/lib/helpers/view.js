View = {
  prose_area : function() { return document.getElementById("prose_text")},
  save : function() {
    if (View.edit_mode()) {
      view_id = Session.get("selected_prose").url;
      old_view = Session.get("saved_view");
      view = {caret_pos: Caret.get(this.prose_area()), scroll_pos: this.prose_area().scrollTop, window_pos: document.body.scrollTop};

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
    if (View.edit_mode()) {
      this.prose_area().focus();
      view_id = Session.get("selected_prose").url;
      view = Session.get("saved_view");

      if (view !== undefined && (view = view[view_id]) !== undefined) {
        Caret.set(this.prose_area(), view.caret_pos);
        this.prose_area().scrollTop = view.scroll_pos;
        document.body.scrollTop = document.documentElement.scrollTop = view.window_pos;
      }
    }
  },
  set_caret : function(caret_pos) {
    Caret.set(this.prose_area(), caret_pos);
  },
  edit_mode : function() {
    view_mode = Session.get("view_mode");
    return (!view_mode || (view_mode === undefined))
  },
  cursor_scroll : function() {
    helper = document.getElementById('text-height-helper').firstChild;
    cursor_pos = Caret.get(this.prose_area());
    helper.innerHTML = this.prose_area().value.substr(0, cursor_pos).replace(/\n$/,"\n\001");
    rects = document.getElementById('text-height-helper').getClientRects();
    lastRect = rects[rects.length - 1];

    document.body.scrollTop = document.documentElement.scrollTop = $('#prose_text').position().top + lastRect.height - 200;
  }
}