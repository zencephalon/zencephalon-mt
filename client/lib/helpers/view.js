View = {
  proseArea : function() { return document.getElementById("prose_text")},
  autosize : function() {
    setTimeout(function(){$("textarea").trigger('autosize.resize')}, 400);
  },
  save : function(prose_area) {
    prose_area_jq = $(prose_area);
    if (true) {
      view_id = prose_area_jq.attr("data-prose");
      old_view = Session.get("saved_view");
      
      view = {caret_pos: Caret.get(prose_area), 
             scroll_pos: prose_area.scrollTop, 
             window_pos: document.body.scrollTop};

      if (old_view === undefined) {
        old_view = {};
      }
      old_view[view_id] = view;

      Session.set("saved_view", old_view);
      Session.set("current_view", view_id);
    }
  },
  restore_delayed : function(view_id) {
    setTimeout(function() {View.restore(view_id)}, 150);
  },
  restore : function(view_id) {
    if (view_id === undefined) {
      view_id = Session.get("current_view");
    }

    prose_area = $("[data-prose='" + view_id + "']").get(0);
    if (prose_area !== undefined) {
      prose_area.focus();
      view = Session.get("saved_view");

      if (view !== undefined && (view = view[view_id]) !== undefined) {
        Caret.set(prose_area, view.caret_pos);
        prose_area.scrollTop = view.scroll_pos;
        document.body.scrollTop = document.documentElement.scrollTop = view.window_pos;
      }
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
  setViewMode : function(url, bool) {
    view_mode = Session.get("view_mode");
    if (view_mode === undefined) {
      o = {}
      o[url] = bool;
      Session.set("view_mode", o);
    } else {
      view_mode[url] = bool;
      Session.set("view_mode", view_mode);
    }
  },
  viewMode : function(url) {
    view_mode = Session.get("view_mode");
    if (view_mode !== undefined) {
      return !!view_mode[url];
    } else {
      return false;
    }
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