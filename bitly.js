var fs = require('fs');
var https = require('https');
var querystring = require('querystring');

var config = JSON.parse(fs.readFileSync('bitly_config.json'));

module.exports = {
  shorten: async function(url) {
    return new Promise((success, error) => {
      var requestUrl = 'https://api-ssl.bitly.com/v3/shorten?access_token=' + config.token + "&longUrl=" + querystring.escape(url);
      https.get(JSON.stringify(requestUrl), (resp) => {
        let data = '';
        console.log(resp);
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          success(JSON.parse(data).data.url);
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
        error("error");
      });
    });
  }
}
