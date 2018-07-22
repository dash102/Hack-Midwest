var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var box = require('./box');
var twilio = require('./twilio');
var view = require('./view');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/view', (req, res) => res.send(view.render(req.query['id'])));
app.use(express.static(path.join(__dirname, 'public')));

function sendUrl(fileId, numbers) {
  var url = 'https://roadtrip.us-east-1.elasticbeanstalk.com/view?' + fileId;
  numbers.forEach(number => twilio.send(number, url));
}

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('itinerary', function(jsonString) {
        console.log(jsonString);
        box.put(jsonString.itinerary, sendUrl, jsonString.phoneNumbers);
    });
});

http.listen(3001, function() {
    console.log('listening on *:3001');
});

module.exports = app;
