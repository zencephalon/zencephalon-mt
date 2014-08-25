EPrimer = {
  showErrors : function(text) {
    _.each(["be", "being", "been", "am", "is", "isn't", "are", "aren't", "was", "wasn't", "were", "weren't", "I'm", "you're", "we're", "they're", "he's", "she's", "it's", "there's", "here's", "where's", "how's", "what's", "who's", "that's", "love", "you", "your", "yourself", "you're", "should", "very"], 
      function(word) {
        text = EPrimer.highlighter(word, text);
    });
    return text;
  },
  highlighter : function(word, input) {
    var rgxp = new RegExp("\\b" + word + "\\b", 'ig');
    var repl = '<span class="error">' + word + '</span>';
    return input.replace(rgxp, repl);
  }
}