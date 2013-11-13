/*
 * Generate a unique token
 */
headers.token = new Date().getTime() + Math.random();

/*
 * Called after receiving all the headers, used to re-associate headers
 * with this clients livedata session (see headers-server.js)
 */
headers.store = function(headers) {
	this.list = headers;
	Meteor.call('headersToken', this.token);
};

/*
 * Create another connection to retrieve our headers (see README.md for
 * why this is necessary).  Called with our unique token, the retrieved
 * code runs headers.store() above with the results
 */
(function(d, t) {
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = '/headersHelper.js?token=' + headers.token;
    s.parentNode.insertBefore(g, s);
}(document, 'script'));

/*
 * Get a header or all headers
 */
headers.get = function(header) {
	return header ? this.list[header] : this.list;
}

/*
 * Get the client's IP address (see README.md)
 */
headers.getClientIP = function(proxyCount) {
	var chain = this.list['x-ip-chain'].split(',');
	if (typeof(proxyCount) == 'undefined')
		proxyCount = this.proxyCount;
	return chain[chain.length - proxyCount - 1];
}

var rootUrl;

window.addEventListener("message", function(event) {
  if (rootUrl != event.origin+'/' || event.data.substr(0,8) != 'loginId:')
    return;
  console.log(event.data);
  var data = JSON.parse(event.data.substr(8));
  if (data[0] && data[1]) {
    console.log('Retrieved login info from ' + rootUrl);
    localStorage.setItem("Meteor.loginToken", data[0]);
    localStorage.setItem("Meteor.userId", data[1]);
  } else {
    console.log('No login information available from ' + rootUrl);
  }
});

Meteor.call('getRootUrl', function(error, getRootUrl) {
  rootUrl = getRootUrl;
  var rootHost = /https?:\/\/([A-Za-z\._-]*).*?/.exec(rootUrl)[1];
  var httpHost = headers.get('host').split(':')[0];
  if (rootHost != httpHost) {
    console.log('Not on ROOT_URL, retrieving login details from there...');
    var iframe = $('<iframe>')
      .css('display', 'none')
      .attr('src', rootUrl+'fetchLoginId');
    iframe.load(function() {
      console.log('loaded');
      this.contentWindow.postMessage("x", rootUrl);
    });
    $('body').append(iframe);
  }
});  
