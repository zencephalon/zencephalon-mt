Lover = {
  showLove : function(text) {
    return Lover.highlighter(text);
  },
  highlighter : function(input) {
    var rgxp = /- \(♥\) (.*?)\n/g;
    return input.replace(rgxp, "- (<span class='heart'>♥</span>) <span class='love'>$1</span>\n");
  }
}