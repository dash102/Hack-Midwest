var fs = require('fs');
var config = JSON.parse(fs.readFileSync('twilio_config.json'));
var twilio = require('twilio')(config.accountSid, config.authToken);

module.exports = {
  send: function(to, message) {
    console.log(to);
    console.log(message);
    twilio.messages
      .create({from: '+17852687359', body: message, to: ('+1' + to)});
  }
}
