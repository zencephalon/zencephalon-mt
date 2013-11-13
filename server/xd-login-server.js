Meteor.methods({
  getRootUrl: function() {
    return process.env.ROOT_URL;
  }
});

WebApp.connectHandlers.use('/fetchLoginId', function(req, res, next) {
  var out = '<html><head><script>'
    + 'window.addEventListener("message", function(event) {'
    + '   var loginToken = localStorage.getItem("Meteor.loginToken");'
    + '   var userId = localStorage.getItem("Meteor.userId");'
    + '   var json = JSON.stringify([loginToken, userId]);'
    + '   event.source.postMessage("loginId:"+json, event.origin);'
    + '}, false);'
    + '</script></head></html>';
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(out, 'utf8');
});
