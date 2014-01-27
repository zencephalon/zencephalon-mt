DeftDraft = function(textarea) {
  this.textarea = textarea;
}
// Main function, delegates to helpers.
DeftDraft.prototype.command = function(dir, obj_t) {
  this.textFunc(obj_t).call(this, function(sel, content) { 
    this.selectFunc(dir, sel, content, DeftDraft.regexDict[dir][obj_t]) });
}
// If the selection lies within the text object's boundaries, expand to select it
// If a text object is already selected, select the next or previous one.
DeftDraft.prototype.textFunc = function(t_obj) {
  return function(func) {
    var content = this.textarea.val();
    var sel = this.textarea.getSelection();

    var before = this.boundaryFunc.call(this, 'b', t_obj)(sel.start, content);
    var after = this.boundaryFunc.call(this, 'a', t_obj)(sel.end, content);

    if (before == 0 && after == 0) {
      func.call(this, sel, content);
    } else {
      this.textarea.setSelection(sel.start - before, sel.end + after);
    }
  }
}
// Determine where the boundary for the text object lies in either direction.
DeftDraft.prototype.boundaryFunc = function(dir, t_obj) {
  return function(pos, content) {
    b = DeftDraft.regexDict[dir][t_obj];
    pos -= b[0];
    content = dir == 'a' ? content.substr(pos) : content.substr(0, pos).split('').reverse().join('');
    return (res = b[1].exec(content)) !== null ? res.index : content.length;
  }
}
// Select the next instance of the regex, wrapping around if needed.
DeftDraft.prototype.selectForward = function(sel, content, regex) {
  res = regex.exec(content.substr(sel.end));

  if (res !== null) {
    this.textarea.setSelection(sel.end + res.index, sel.end + res.index + res[0].length - res[1].length);
  } else {
    sel.start = sel.end = 0;
    this.selectForward(sel, content, regex);
  }  
}
// As above but backward.
DeftDraft.prototype.selectBackward = function(sel, content, regex) {
  res = regex.exec(content.substr(0, sel.start).split('').reverse().join(''));

  if (res !== null) {
    this.textarea.setSelection(sel.start - res.index - res[0].length + res[2].length, sel.start - res.index - res[1].length);
  } else {
    sel.start = sel.end = content.length;
    this.selectBackward(sel, content, regex);
  }
}
// Convenience wrapper.
DeftDraft.prototype.selectFunc = function(dir, sel, content, regex) {
  return dir == 'n' ? this.selectForward(sel, content, regex) : this.selectBackward(sel, content, regex);
}
// Stores the regexes used.
DeftDraft.regexDict = {
  'a' : { // after, for boundaries
    'w' : [0, /\W/], // word, no offset, non-word char
    's' : [1, /[.!?](\W|$)/], // sentence, offset for punctuation, punctuation followed by non-word or end
    'l' : [0, /\n/],
    'q' : [0, /\n\n/] // qaragraph, no offset, two new lines
  },
  'b' : { // before, for boundaries -- note these regexes operate on the input reversed
    'w' : [0, /\W/], // word, no offset, non-word char
    's' : [0, /((^|\W)[.!?]|\n)/], // sentence, no offset, (punctuation followed by non-word or start) or new line
    'l' : [0, /\n/],
    'q' : [0, /\n\n/] // qaragraph, no offset, two new lines
  },
  'n' : { // next, for selections
    'w' : /[\w']+(\W|$)/, // word, a number of word chars ended by end or non-word char
    's' : /.*?[.!?](\W|$)/, // sentence, a number of chars ended by punctuation and non-char char or end
    'l' : /(\n)/,
    'q' : /.+(\n\n|$)/ // qaragraph, a number of chars ended by two new lines or the end
  },
  'p' : {
    'w' : /(^|\W)[\w']+(\W|$)/, // word, a number of word chars ended by end or non-word char
    's' : /(^|\W)[.?!].*?(\W[.!?]|$|\n\n)/, // sentence, can start with new paragraph or start of text, or end of earlier sentence, a number of chars, ending in punctuation followed by non-word char or end
    'l' : /(.)/,
    'q' : /(\n\n|^).+(\n\n|$)/ // qaragraph, start with new paragraph or start of text end with paragraph or end
  }
}