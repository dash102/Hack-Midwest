var box = require('./box');
var fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
  render: async function(id) {
    console.log('here');
    var file = await box.get(id);

    const doc = new JSDOM(fs.readFileSync('public/index.html')).window.document;

    var itineraryDiv = doc.getElementById('itinerary');
    var elements = file.itinerary;

    elements.forEach((element) => {
      var div = doc.createElement('div');
      var name = doc.createElement('h3');
      var startDate = doc.createElement('h3');
      var endDate = doc.createElement('h3');
      var time = doc.createElement('time');
      var comments = doc.createElement('comments');

      name.innerHTML = element.checkpointName;
      startDate.innerHTML = element.startDate;
      endDate.innerHTML = element.endDate;
      time.innerHTML = element.time;
      comments.innerHTML = element.comments;

      div.appendChild(name);
      div.appendChild(startDate);
      div.appendChild(endDate);
      div.appendChild(time);
      div.appendChild(comments);
    });

    return doc;
  }
};
