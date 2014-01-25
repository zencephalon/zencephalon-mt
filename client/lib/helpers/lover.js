Lover = {
  showLove : function(text) {
    return Lover.highlighter(text);
  },
  highlighter : function(input) {
    var rgxp = /- \(♥\)(.*?)\n/g;
    //while (rgxp.test(input)) {
      input = input.replace(rgxp, "- (<span class='heart'>♥</span>)<span class='love'>$1</span>\n");
    //}
    return input;
  }
}