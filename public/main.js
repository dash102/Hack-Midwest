var CLIENT_ID = config.CLIENT_ID;
var CLIENT_SECRET = config.CLIENT_SECRET;
var MAPS_API_KEY = config.MAPS_API_KEY;

function initMap() {
    startMapbox();
}

function addSearch(map) {
  console.log("adding search");
  map.addControl(new MapboxGeocoder({
    accessToken: MAPS_API_KEY,
    placeholder: 'Where would you like to go?'
  }));
  
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
                    console.log(content);
                    // add marker here
                    var marker = new mapboxgl.Marker()
                      .setLngLat([venueLng, venueLat]);
                    markers.push(marker);
                    marker.addTo(map);
                });
            });
    });
    /*map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['kc-locations']
      });
    
      if (!features.length) {
        return;
      }
    
      var feature = features[0];

      var secondaryFeatureString = feature.properties.category_secondary != undefined ? ' (' + 
        feature.properties.category_secondary + ')' : '';
      var photoString = feature.properties.photo != undefined ? '<img src=' + feature.properties.photo + ' height="300" />': '';
      var ratingString = feature.properties.rating != undefined ? '<p>Rating: ' + feature.properties.rating + '</p>' : '';
      var wifiString = feature.properties.wifi ? '<p style="color:green">Wifi available</p>' : '';
      var phoneString = feature.properties.phonenumber != undefined ? '<p>Call: ' + feature.properties.phonenumber + '</p>' : '';

      htmlString = '<h3>' + feature.properties.name + '</h3><h5>Category: ' + 
        feature.properties.category_primary + secondaryFeatureString + '</h5><p>Address: ' + feature.properties.address +
        ', ' + feature.properties.state + '</p>' + phoneString + photoString + ratingString + wifiString;
      console.log(feature);

      var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(htmlString)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
        
        map.flyTo({ center: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] });
    });*/

}