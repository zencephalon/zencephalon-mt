Journal = {
  defaultTemplate : "#### TODO?\n\n#### Code?\n\n#### Meditate?\n\n#### Exercise?\n\n#### Taijutsu?\n\n#### Journal?\n",
  template : function() {
    name = "__journal_template__";
    template = Prose.get(name);
    if (template._id === undefined) {
      Prose.create("Journal Template", name, Journal.defaultTemplate, true);
      return Journal.defaultTemplate;
    } else {
      return template.getBranch().text;
    }
  },
  getDayString : function(d) {
    return Util.cleanURL(d.toLocaleDateString());
  },
  today : function() {
    d = new Date();
    day_string = Journal.getDayString(d);

    if (Prose.get(day_string)._id === undefined) {
      title = _.first(d.toString().split(" "), 4).join(" ");
      Prose.create(title, day_string, Journal.template(), true);
    } 
    return day_string;
  },
  getSelectedDay : function() {
    d = Session.get("journal_day");
    return (d == null ? Journal.today() : d);
  },
  getDayFunc : function(func) {
    d = Journal.getSelectedDay();
    ds = d.split('_');
    // Months are 0 indexed... so bad.
    d = new Date(ds[2], ds[0] - 1, ds[1]);
    return Journal.getDayString(func(d.getTime()));
  },
  getPreviousDay : function() {
    return Journal.getDayFunc(function(d) {
      return new Date(d - Journal.day_seconds);
    });
  },
  getNextDay : function() {
    return Journal.getDayFunc(function(d) {
      return new Date(d + Journal.day_seconds);
    });
  },
  day_seconds : 60*60*24*1000,
  keyBindFunc : function(j) {
    View.setViewMode(j, false);
    Session.set("journal_day", j);
    Router.go('prose', {url: j}); 
    View.autosize();
    View.restore_delayed(j);
    return false;
  },
  bindKeys : function() {
    Mousetrap.bind('ctrl+shift+j', function(e) { 
      return Journal.keyBindFunc(Journal.today());
    });
    Mousetrap.bind('ctrl+j', function(e) {
      return Journal.keyBindFunc(Journal.getPreviousDay());
    });
    Mousetrap.bind('ctrl+k', function(e) {
      return Journal.keyBindFunc(Journal.getNextDay());
    });
  }
}