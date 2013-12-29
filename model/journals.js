Journal = {
  defaultTemplate : "#### TODO?\n\n#### Code?\n\n#### Meditate?\n\n#### Exercise?\n\n#### Taijutsu?\n\n#### Journal?\n",
  template : function() {
    name = "__journal_template__";
    template = Prose.get(name);
    if (template._id === undefined) {
      Prose.create("Journal Template", name, Journal.defaultTemplate, true);
      return Journal.defaultTemplate;
    } else {
      return Branch.get(template._id, template.branch).text;
    }
  },
  today : function() {
    d = new Date();
    day_string = Util.cleanURL(d.toLocaleDateString());

    if (Prose.get(day_string)._id === undefined) {
      title = _.first(d.toString().split(" "), 4).join(" ");
      Prose.create(title, day_string, Journal.template(), true);
    } 
    return day_string;
  },
  bindKeys : function() {
    Mousetrap.bind('ctrl+j', function(e) { 
      j = Journal.today(); 
      Session.set("view_mode", false);
      Router.go('prose', {url: j}); 
      return false;
    });
  }
}