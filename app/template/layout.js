if (Meteor.isClient) {

  Template.layout.rendered = function() {
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
  }
}


