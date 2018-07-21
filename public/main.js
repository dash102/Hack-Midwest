var CLIENT_ID = config.CLIENT_ID;
var CLIENT_SECRET = config.CLIENT_SECRET;
var MAPS_API_KEY = config.MAPS_API_KEY;

function initMap() {
    // The location of Uluru
    //var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: uluru, map: map});
    //initAutocomplete(map);
    startMapbox();
}

function startMapbox() {
    mapboxgl.accessToken = MAPS_API_KEY;
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/dash102/cjjvnp4yx5e3x2sqvqddxuhd9',
      center: [-94.5786, 39.0997],
      zoom: 8
    });

    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['kc-locations'] // replace this with the name of the layer
      });
    
      if (!features.length) {
        return;
      }
    
      var feature = features[0];
      console.log(feature);
      var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML('<h3>' + feature.properties.name + '</h3><h5>Category: ' + feature.properties.category_primary + '</h5><p>' + feature.properties.description + '</p>')
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
    });
}

/*function initAutocomplete(map) {

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    var submitButton = document.getElementById('submit-query-button');
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    submitButton.addEventListener('click', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        console.log("nothing");
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var latlng = place.geometry.location;
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();

        var query = document.getElementById('query-input').value;
        console.log('here');
        var fourSquareLink = 'https://api.foursquare.com/v2/venues/explore/?' + 
        'll=' + lat + ',' + lng + '&' + 
        'limit=100&' + 
        'query=' + query + '&' + 
        'client_id=' + CLIENT_ID + '&' + 
        'client_secret=' + CLIENT_SECRET +
        '&v=20180719';
        console.log(fourSquareLink);
        $.getJSON(fourSquareLink,
            function (data) {
                console.log('here2');
                console.log(data);
                $.each(data.response.groups[0].items, function (i, venue) {
                    var venueLat = venue.venue.location.lat;
                    var venueLng = venue.venue.location.lng;
                    content = 'Name: ' + venue.venue.name +
                                ' Address: ' + venue.venue.location.address +
                                ' Lat/long: ' + venueLat + ', ' + venueLng + '\n';
                    console.log(content);

                    markers.push(new google.maps.Marker({
                        map: map,
                        icon: icon,
                        title: venue.venue.name,
                        position: {lat: venueLat, lng: venueLng}
                    }));
                });
            });
        // Create a marker for each place.

        //start comment out
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));
        //end comment out

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }
  */