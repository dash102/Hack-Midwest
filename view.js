var box = require('./box');
var fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
  render: async function(id) {
    var file = await box.get(id);

    const doc = new JSDOM(fs.readFileSync('public/index.html')).window.document;

    doc.getElementById('confirmationModal').parentNode.removeChild(doc.getElementById('confirmationModal'))
    doc.getElementById('phoneNumberModal').parentNode.removeChild(doc.getElementById('phoneNumberModal'));
    doc.getElementById('myModal').parentNode.removeChild(doc.getElementById('myModal'));
    doc.getElementById('geocoder').parentNode.removeChild(doc.getElementById('geocoder'));
    doc.getElementById('query-input').parentNode.removeChild(doc.getElementById('query-input'));
    doc.getElementById('submit-query-button').parentNode.removeChild(doc.getElementById('submit-query-button'));
    doc.getElementById('query-text').parentNode.removeChild(doc.getElementById('query-text'));

    var itineraryDiv = doc.getElementById('itinerary');
    var divs = [];

    JSON.parse(file).forEach((element) => {
      var div = doc.createElement('div');
      var name = doc.createElement('h3');
      var startDate = doc.createElement('h3');
      var endDate = doc.createElement('h3');
      var time = doc.createElement('h3');
      var comments = doc.createElement('h3');

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

      divs.push(div);
    });

    divs.forEach(d => itineraryDiv.appendChild(d));

    console.log(doc.documentElement.outerHTML);
    return doc.documentElement.outerHTML;
  }
};
