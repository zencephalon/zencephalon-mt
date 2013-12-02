View = {
  save : function() {
    prose_area = document.getElementById("prose_text");
    view = {caret_pos: Caret.get(prose_area), scroll_pos: prose_area.scrollTop, window_pos: document.body.scrollTop};
    Session.set("saved_view", view);
    //Session.set("caret_pos", Caret.get(prose_area));
    //Session.set("scroll_pos", prose_area.scrollTop);
    //Session.set("window_pos", document.body.scrollTop);
  },
  restore : function() {
    $("#prose_text").focus();
    prose_area = document.getElementById("prose_text");
    view = Session.get("saved_view");
    if (view !== undefined) {
      Caret.set(prose_area, view.caret_pos);
      prose_area.scrollTop = view.scroll_pos;
      document.body.scrollTop = document.documentElement.scrollTop = view.window_pos;
    }
  },
  edit_mode : function() {
    view_mode = Session.get("view_mode");
    return (!view_mode && (view_mode !== undefined))
  }
}