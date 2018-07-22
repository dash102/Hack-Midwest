var CLIENT_ID = config.CLIENT_ID;
var CLIENT_SECRET = config.CLIENT_SECRET;
var MAPS_API_KEY = config.MAPS_API_KEY;

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
        console.log(fourSquareLink);
        $.getJSON(fourSquareLink,
            function (data) {

                console.log(data);
                $.each(data.response.groups[0].items, function (i, venue) {
                    var venueLat = venue.venue.location.lat;
                    var venueLng = venue.venue.location.lng;
                    content = 'Name: ' + venue.venue.name +
                                ' Address: ' + venue.venue.location.address +
                                ' Lat/long: ' + venueLat + ', ' + venueLng + '\n';
                    // add marker here
                    marker = new mapboxgl.Marker()
                      .setLngLat([venueLng, venueLat]);
                    var popup = new mapboxgl.Popup({ offset: [0, -30] })
                      .setLngLat(marker._lngLat)
                      .setHTML("hi")
                      .addTo(map);
                    marker.setPopup(popup);
                    marker.togglePopup(popup);
                    markers.push(marker);
                    marker.addTo(map);
                });
            });
      });
}
