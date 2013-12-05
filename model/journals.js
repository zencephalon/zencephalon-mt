Journal = {
  template : function() {
    return "#### Code?\n\n#### Meditate?\n\n#### Exercise?\n\n#### Taijutsu?\n\n#### Journal?\n"
  },
  today : function() {
    d = new Date();
    day_string = d.toLocaleDateString().replace(/\//g, '_');
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