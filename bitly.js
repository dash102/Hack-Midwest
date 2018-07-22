var fs = require('fs');
var https = require('https');
var querystring = require('querystring');
var request = require('request-promise');

var config = JSON.parse(fs.readFileSync('bitly_config.json'));

module.exports = {
  shorten: function(url) {
    var requestUrl = 'https://api-ssl.bitly.com/v3/shorten?access_token=' + config.token + "&longUrl=" + querystring.escape(url);

    return request({
      "method": "GET",
      "uri": requestUrl
    });
  }
}
