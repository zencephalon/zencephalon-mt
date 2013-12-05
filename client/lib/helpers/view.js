View = {
  prose_area : function() { return document.getElementById("prose_text")},
  save : function() {
    view = {caret_pos: Caret.get(this.prose_area()), scroll_pos: this.prose_area().scrollTop, window_pos: document.body.scrollTop};
    Session.set("saved_view", view);
  },
  restore : function() {
    this.prose_area().focus();
    view = Session.get("saved_view");
    if (view !== undefined) {
      Caret.set(this.prose_area(), view.caret_pos);
      this.prose_area().scrollTop = view.scroll_pos;
      document.body.scrollTop = document.documentElement.scrollTop = view.window_pos;
    }
  },
  set_caret : function(caret_pos) {
    Caret.set(this.prose_area(), caret_pos);
  },
  edit_mode : function() {
    view_mode = Session.get("view_mode");
    return (!view_mode && (view_mode !== undefined))
  }
}