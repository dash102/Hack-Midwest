var CLIENT_ID = config.CLIENT_ID;
var CLIENT_SECRET = config.CLIENT_SECRET;
var MAPS_API_KEY = config.MAPS_API_KEY;
var currentVenue;
var itineraryJSON = {
  "sendTo" : [

  ],
  "itinerary" : [
  ]
};
function initMap() {
    startMapbox();
}

function addSearch(map) {
  console.log("adding search");
  var geocoder = new MapboxGeocoder({
    accessToken: MAPS_API_KEY,
    placeholder: 'Where would you like to go?'
  });
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));  
  console.log(geocoder);
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
            currentVenue = venue;
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
            var address = street + '<br>' + city + ', ' + state + ' ' + zip;
            var button = '<button id="details-button" onclick="viewLocationDetails();">See details</button>';

            var id = venue.venue.id;
            var htmlString = '<h3>' + name + '</h3><h5>' + address + '</h5>' + button;
            var popup = new mapboxgl.Popup({ offset: [0, -30] })
              .setLngLat(marker._lngLat)
              .setHTML(htmlString)
              .addTo(map);
            marker.setPopup(popup);
            marker.togglePopup(popup);
            markers.push(marker);
            marker.addTo(map);
          });
        });
    });
}

function viewLocationDetails() {
  console.log(currentVenue);
  var name = currentVenue.venue.name;
  var category = currentVenue.venue.categories[0].name;
  var street = currentVenue.venue.location.address;
  var address = currentVenue.venue.location.city + ", " + 
                currentVenue.venue.location.state + " " + 
                currentVenue.venue.location.postalCode;
  document.getElementById('name').innerHTML = name != undefined ? name : '';
  document.getElementById('category').innerHTML = category != undefined ? category : '';
  document.getElementById('street').innerHTML = street != undefined ? street : '';
  document.getElementById('city-state-postalCode').innerHTML = address != undefined ? address : '';
  var addLocation = document.getElementById('add-to-itinerary');
  addLocation.style.display = "block";
  addLocation.onclick = function(e) { 
    openModal();
  }
}

function openModal() {
  var modal = document.getElementById('myModal');
  // Get the <span> element that closes the modal
  var close = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  var geocoder = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[0];
  geocoder.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
  close.style.color = 'rgba(0, 0, 0, 0.01)';
  // When the user clicks on <span> (x), close the modal
  close.onclick = function() {
      modal.style.display = "none";
      geocoder.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  }
  window.onclick = function(e) {
      if (e.target == modal) {
          modal.style.display = "none";
          geocoder.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      }
  }
}