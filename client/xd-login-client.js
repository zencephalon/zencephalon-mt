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
