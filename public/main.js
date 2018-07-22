var CLIENT_ID = config.CLIENT_ID;
var CLIENT_SECRET = config.CLIENT_SECRET;
var MAPS_API_KEY = config.MAPS_API_KEY;
var venues = [];
var itineraryJSON = {
  "phoneNumbers" : [

  ],
  "itinerary" : [
  ]
};
var instance;
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, edge='left');
  instance = M.Sidenav.getInstance(elems[0]);
});

function initMap() {
    startMapbox();
}

function addSearch(map) {
  var geocoder = new MapboxGeocoder({
    accessToken: MAPS_API_KEY,
    placeholder: 'Where would you like to go?'
  });
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
}

function startMapbox() {
  mapboxgl.accessToken = MAPS_API_KEY;
  var map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/dash102/cjjvnp4yx5e3x2sqvqddxuhd9',
    style: 'mapbox://styles/mapbox/streets-v10',
    zoom: 1
  });

  addSearch(map);

  var findRecommendationButton = document.getElementById('submit-query-button');
  var markers = [];

  var marker;
  findRecommendationButton.addEventListener('click', function() {
    var latRec = map.getCenter().lat;
    var lngRec = map.getCenter().lng;
    for (var i = 0; i < markers.length; i++) {
      markers[i].remove();
    }

    var query = document.getElementById('query-input').value;
    query = query.replace(/\s/g, '_');
    var fourSquareLink = 'https://api.foursquare.com/v2/venues/explore/?' +
      'll=' + latRec + ',' + lngRec + '&' + // change lat lng here
      'limit=100&' +
      'query=' + query + '&' +
      'client_id=' + CLIENT_ID + '&' +
      'client_secret=' + CLIENT_SECRET +
      '&v=20180719';
      $.getJSON(fourSquareLink,
        function (data) {

          $.each(data.response.groups[0].items, function (i, venue) {
            venues.push(venue);
            var venueLat = venue.venue.location.lat;
            var venueLng = venue.venue.location.lng;
            // add marker here
            marker = new mapboxgl.Marker()
              .setLngLat([venueLng, venueLat]);
            var name = venue.venue.name;
            var street = venue.venue.location.address;
            var city = venue.venue.location.city;
            var state = venue.venue.location.state;
            var zip = venue.venue.location.postalCode;
            //var category = venue.venue.categories[0].name;
            var address = street + '<br>' + city + ', ' + state + ' ' + zip;
            //var button = '<button id="details_button_' + venueLat + '_' + venueLng + ' onclick="viewLocationDetails(this);">See details</button>';

            var domElement = document.createElement('div');
            var nameHeading = document.createElement('h4');
            var address = document.createElement('h6');
            var detailsButton = document.createElement('button');
            detailsButton.className='btn waves-effect waves-light';
            detailsButton.innerHTML = "See Details";
            nameHeading.innerText = name;
            address.innerText = street + '\n' + city + ', ' + state + ' ' + zip;
            detailsButton.addEventListener('click', function() {
              viewLocationDetails(venue);
            });

            domElement.appendChild(nameHeading);
            domElement.appendChild(address);
            domElement.appendChild(detailsButton);

            var id = venue.venue.id;
            //var htmlString = '<h3>' + name + '</h3><h5>' + address + '</h5>' + button;
            var popup = new mapboxgl.Popup({ offset: [0, -35] })
              .setLngLat(marker._lngLat)
              //.setHTML(htmlString)
              .setDOMContent(domElement)
              .addTo(map);
            marker.setPopup(popup);
            marker.togglePopup(popup);
            markers.push(marker);
            marker.addTo(map);
          });
        });
    });
}

function viewLocationDetails(currentVenue) {
  instance.open();
  var name = currentVenue.venue.name;
  var category = currentVenue.venue.categories[0].name;
  var street = currentVenue.venue.location.address;
  var address = currentVenue.venue.location.city + ", " +
                currentVenue.venue.location.state + " " +
                currentVenue.venue.location.postalCode;
  //var address = city + ", " + state + " " + postalCode;
  document.getElementById('name').innerHTML = name != undefined ? name : '';
  document.getElementById('category').innerHTML = category != undefined ? category : '';
  document.getElementById('street').innerHTML = street != undefined ? street : '';
  document.getElementById('city-state-postalCode').innerHTML = address != undefined ? address : '';
  var addLocation = document.getElementById('add-to-itinerary');
  addLocation.style.display = "block";
  addLocation.onclick = function(e) {
    instance.close();
    openModal(currentVenue);
  }
}

var gCoordinatesLat;
var gCoordinatesLng;
var gModal;
function openModal(currentVenue) {
  var modal = document.getElementById('myModal');
  // Get the <span> element that closes the modal
  var close = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  var geocoder = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[0];
  var geocoderClose = document.getElementsByClassName('.mapboxgl-ctrl-geocoder .geocoder-pin-right');
  geocoder.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
  //geocoderClose.style.backgroundColor = 'rgba(0, 0, 0, 1)'; // WRONG
  // When the user clicks on <span> (x), close the modal
  window.onclick = function(e) {
      if (e.target == modal) {
          modal.style.display = "none";
          geocoder.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          geocoderClose.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      }
  }

  var coordinatesLat = currentVenue.venue.location.lat;
  var coordinatesLng = currentVenue.venue.location.lng;
  gCoordinatesLat = coordinatesLat;
  gCoordinatesLng = coordinatesLng;
  gModal = modal;

}

var submitButton = document.getElementById('submit-itinerary');
submitButton.addEventListener('click', function() {
  var locationName = document.getElementById('name').innerHTML;
  var street = document.getElementById('street').innerHTML
  var cityStatePostalCode = document.getElementById('city-state-postalCode').innerHTML;
  var checkpointName = document.getElementById('checkpoint').value;
  var startDate = document.getElementById('start').value;
  var endDate = document.getElementById('end').value;
  var time = document.getElementById('trip-time').value;
  var comments = document.getElementById('comments').value;
  addToItinerary(locationName, street, cityStatePostalCode, startDate, endDate, time, gCoordinatesLat, gCoordinatesLng, checkpointName, comments);
  gModal.style.display = "none";
});

  var submitButton = document.getElementById('submit-itinerary');
}

function addToItinerary(locationName, street, cityStatePostalCode, startDate, endDate, time, coordinatesLat, coordinatesLng, checkpointName, comments) {
  console.log(locationName);
  var object = {"locationName": locationName, "street": street, "cityStatePostalCode": cityStatePostalCode, "checkpointName": checkpointName, "startDate" : startDate,
                "endDate" : endDate, "time" : time, "coordinates" : {"lat" : coordinatesLat, "lng" : coordinatesLng},
                "comments" : comments};
  itineraryJSON.itinerary.push(object);
  addToItineraryDisplay(object);
  showConfirmationModal();
}

function addToItineraryDisplay(object) {
  var checkpointString = "<h5>" + object.checkpointName + "</h5>" + 
                         "<h6>Start: " + object.startDate + " | " + "End: " + object.endDate + "</h6>" + 
                         "<h6>Time: " + object.time + "</h6><br>";
  document.getElementById('itinerary-display').innerHTML += checkpointString;
}

function showConfirmationModal() {
  var confirmationModal = document.getElementById('confirmationModal');
  confirmationModal.style.display = "block";
  var yesButton = document.getElementById('continue');
  var noButton = document.getElementById('finish');
  yesButton.addEventListener('click', function() {
    confirmationModal.style.display = "none";
  });

  noButton.addEventListener('click', function() {
    confirmationModal.style.display = "none";
    promptNumbers();
  });
}

function promptNumbers() {
  var phoneNumberModal = document.getElementById('phoneNumberModal');
  phoneNumberModal.style.display = "block";
  var doneNumbers = document.getElementById('done-numbers');
  var numbersArray = [];
  doneNumbers.addEventListener('click', function() {
    numbersArray = document.getElementById('phone-numbers').value.split('\n');
    numbersArray.forEach(function(number) {
      itineraryJSON.phoneNumbers.push(number);
    });

    finishItinerary();
    phoneNumberModal.style.display = "none";
  });
}

function finishItinerary() {
  
  var finishedModal = document.getElementById('doneModal');
  finishedModal.style.display = "block";
  socket.emit('itinerary', itineraryJSON);
}
