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
    return (!view_mode || (view_mode === undefined))
  },
  cursor_scroll : function() {
    helper = document.getElementById('text-height-helper').firstChild;
    cursor_pos = Caret.get(this.prose_area());
    helper.innerHTML = this.prose_area().value.substr(0, cursor_pos).replace(/\n$/,"\n\001");
    rects = document.getElementById('text-height-helper').getClientRects();
    lastRect = rects[rects.length - 1];
    console.log($('#prose_text').position().top);
    console.log(lastRect.height);
    new_top = $('#prose_text').position().top + lastRect.height - 100;
    console.log("top: " + new_top);
    document.body.scrollTop = document.documentElement.scrollTop = new_top;
  }
}