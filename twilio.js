var fs = require('fs');
var config = JSON.parse(fs.readFileSync('twilio_config.json'));
var twilio = require('twilio')(config.accountSid, config.authToken);
var bitly = require('./bitly');

module.exports = {
  send: async function(to, message) {
    console.log(to);
    console.log('a'+message);

    var data = await bitly.shorten(message);
    console.log(JSON.stringify(data));

    twilio.messages
      .create({from: '+17852687095', body: JSON.parse(data).data.url, to: ('+1' + to)});
  }
}
