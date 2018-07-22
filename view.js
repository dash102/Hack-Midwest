var box = require('./box');
var fs = require('fs');
var jsdom = require('jsdom');
var config = require('./public/config');
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

    var itineraryDiv = doc.getElementById('itinerary-display');
    var divs = [];
    var json = JSON.parse(file);
    json.forEach((element) => {
      var div = doc.createElement('div');
      var checkpointName = doc.createElement('h3');
      checkpointName.id = 'checkpointName';
      var locationName = doc.createElement('h3');
      locationName.id = 'locationName';
      var street = doc.createElement('h3');
      street.id = 'street';
      var cityStatePostalCode = doc.createElement('h3');
      cityStatePostalCode.id = 'cityStatePostalCode';
      var startDate = doc.createElement('h3');
      startDate.id = 'startDate';
      var endDate = doc.createElement('h3');
      endDate.id = 'endDate';
      var time = doc.createElement('h3');
      time.id = 'time';
      var comments = doc.createElement('h3');
      comments.id = 'comments';
      var lat = doc.createElement('h3');
      lat.id = 'lat';
      var lng = doc.createElement('h3');
      lng.id = 'lng';

      locationName.innerHTML = element.locationName;
      checkpointName.innerHTML = element.checkpointName;
      street.innerHTML = element.street;
      cityStatePostalCode.innerHTML = element.cityStatePostalCode;
      startDate.innerHTML = element.startDate;
      endDate.innerHTML = element.endDate;
      time.innerHTML = element.time;
      comments.innerHTML = element.comments;
      lat.innerHTML = element.coordinates.lat;
      lng.innerHTML = element.coordinates.lng;

      street.style.display = "none";
      cityStatePostalCode.style.display = "none";
      lat.style.display = "none";
      lng.style.display = "none";

      div.appendChild(checkpointName);
      div.append(locationName);
      div.append(street);
      div.append(cityStatePostalCode);
      div.appendChild(startDate);
      div.appendChild(endDate);
      div.appendChild(time);
      div.appendChild(comments);
      div.appendChild(lat);
      div.appendChild(lng);

      divs.push(div);
      console.log(divs.length);
    });

    divs.forEach(d => itineraryDiv.appendChild(d));

    console.log(doc.documentElement.outerHTML);
    return doc.documentElement.outerHTML;
  }
};
