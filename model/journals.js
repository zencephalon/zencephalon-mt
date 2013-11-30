Journal = {
  template : function() {
    return "#### Code?\n\n#### Meditate?\n\n#### Exercise?\n\n#### Taijutsu?\n\n#### Journal?\n"
  },
  today : function() {
    d = new Date();
    day_string = (d.getMonth() + 1) + "_" + d.getDate() + "_" + d.getFullYear();
    if (Prose.get(day_string)._id === undefined) {
      Prose.create(day_string, day_string, Journal.template(), true);
    } 
    return day_string;
  }
}