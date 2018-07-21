var fs = require('fs');
var config = JSON.parse(fs.readFileSync('twilio_config.json'));
var twilio = require('twilio')(config.accountSid, config.authToken);

module.exports = {
  send: function(to, message) {
    twilio.messages
      .create({from: '+17852687359', body: message, to: ('+1' + to)});
  }
}
