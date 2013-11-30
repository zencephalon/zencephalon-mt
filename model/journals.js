Journal = {
  template : function() {
    return "- Code?\n- Meditate?\n- Exercise?\n- Taijutsu?\n- Journal?\n"
  },
  today : function() {
    d = new Date();
    day_string = d.getMonth() + "_" + d.getDay() + "_" + d.getFullYear();
    if (Prose.get(day_string)._id === undefined) {
      Prose.create(day_string, day_string, Journal.template(), true);
    } 
    return day_string;
  }
}