var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var box = require('./box');
var twilio = require('./twilio');
var view = require('./view');
var bitly = require('./bitly');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.get('/view', async (req, res) => res.send(await view.render(req.query['id'])));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(80);

function sendUrl(fileId, numbers) {
  var url = 'https://roadtrip.us-east-1.elasticbeanstalk.com/view?id=' + fileId;
  numbers.forEach(number => twilio.send(number, url));
}
/*
io.on('connection', function(socket) {
    socket.on('itinerary', function(json) {
        console.log(json);
        box.put(json.itinerary, sendUrl, json.phoneNumbers);
    });
});

http.listen(3001, function() {
    console.log('listening on *:3001');
});
*/
module.exports = app;
