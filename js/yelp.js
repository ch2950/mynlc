var auth = { 
  //
  // Update with your auth tokens.
  //
  consumerKey: "8cffnsYfNwVLjvsOicLCqg", 
  consumerSecret: "ubgZQyb-pApuQYj4K18nc5ak0UA",
  accessToken: "bnkOn2SiFe2Y_O7tj_XcIYgxa9ivprbx",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "UQF_SYi0ZKDXadn9KnJ2bhSej6s",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

var terms = 'food';
var near = 'San+Francisco';

var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};

parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

var message = { 
  'action': 'http://api.yelp.com/v2/search',
  'method': 'GET',
  'parameters': parameters 
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);

var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
console.log(parameterMap);

// The following section deals with persistent caching. 

var params = JSON.stringify(parameterMap);
if (localStorage && localStorage.getItem(params)) {
  JSON.parse(localStorage.getItem(params))
} else {
  $.ajax({
  'url': message.action,
  'data': parameterMap,
  'cache': true,
  'dataType': 'jsonp',
  'jsonpCallback': 'cb',
  'success': function(data, textStats, XMLHttpRequest) {
    console.log(data);
    var output = prettyPrint(data);
    $("body").append(output);
    localStorage.setItem(params, JSON.stringify(data));
  }})
}
