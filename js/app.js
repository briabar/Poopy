var map;
var infoWindow;
var meMarker;
var pos = {};
var markers = [];
var icons = {
  restroom: {
    icon: 'img/toilet.jpg'
  },
  meMarker: {
    icon: 'img/me.png'
  }
}

function initMap() {
// Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6272037, lng: -122.3410009},
    zoom: 13,
    mapTypeControl: false
  });
  infoWindow = new google.maps.InfoWindow();

  //if you have geolocation fetch current position and refresh map
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      map.setCenter(pos);

      bathrooms = ko.observableArray([
        {title: 'Sure Shot Cafe', location: {lat: 47.66148, lng: -122.31346},
         features:
          {male: true, female: false, unisex: false, handycap: true,
          changingStation: true, free: true, cost: 0, withPurchase: false,
          publicRestRoom: true},
         rating: 4, type: 'restroom', comments: ['Always clean, but sometimes busy.']},
         {title: "", location: pos,
          features:
           {male: false, female: false, unisex: false, handycap: false,
            changingStation: false, free: false, cost: false, withPurchase: false,
            publicRestRoom: false},
          rating: false, type: 'meMarker', comments: ['You are here!']}
      ]);

      //error fetching location data
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
    //geolocation not supported by browser
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }

  //function for handling geolocation error
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
}; //END OF initMap()

//Function returns string of beautifully formatted bathroom features for infoWindow
function getFeatures(marker) {
  var brFeatures = "";
  if (marker.features['male']) {
    brFeatures += "Gender: Male";
  };
  if (marker.features['female']) {
    brFeatures += "<p>Gender: Female</p>";
  };
  if (marker.features['unisex']) {
    brFeatures += "<p>Gender: Unisex</p>";
  };
  if (marker.features['handycap']) {
    brFeatures += "<p>Handycap Accesible: Yes</p>";
  };
  if (marker.features['changingStation']) {
    brFeatures += "<p>Changing Station: Yes</p>";
  };
  if (marker.features['free']) {
    brFeatures += "<p>Cost: Free</p>";
  };
  if (!marker.features['free']  && marker.features['free'] !== false) {
    brFeatures += "<p>Cost: " + marker.features['cost'] + '</p>';
  };
  if (marker.features['withPurchase']) {
    brFeatures += "<p>Purchase Required: Yes</p>";
  };
  if (marker.features['publicRestRoom']) {
    brFeatures += "<p>Public Restroom: Yes</p>";
  };
  if (marker.features['rating']) {
    brFeatures += "<p>rating: " + marker.rating + "/5</p>";
  };
  if (marker.comments[0]) {
    for (comment in marker.comments) {
      brFeatures += "<p style=\"color:#ffcc00;\">" + marker.comments + "</p>";
    }
  }
  return brFeatures;
}

function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    var brFeatures = getFeatures(marker);
    infowindow.setContent('<div><h2>' + marker.title + '</h2>'+ brFeatures + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

function showMarkers(bathroomsArray) {
  for(place in bathrooms()) {
    var position = bathrooms()[place].location;
    var title = bathrooms()[place].title;
    var features = bathrooms()[place].features;
    var rating = bathrooms()[place].rating;
    var comments = bathrooms()[place].comments;
    console.log(comments);
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      features: features,
      rating: rating,
      animation: google.maps.Animation.DROP,
      id: place,
      comments: comments,
      icon: icons[bathrooms()[place].type].icon
    });
    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, infoWindow);
    });
  };
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (marker in markers) {
    markers[marker].setMap(map);
    //bounds.extend(markers[marker].position);
  };
}





//this is the viewmodel
var ViewModel = function() {
  this.showListings = function() {
    showMarkers(bathrooms());
    // for(place in bathrooms()) {
    //   var position = bathrooms()[place].location;
    //   var title = bathrooms()[place].title;
    //   var features = bathrooms()[place].features;
    //   var rating = bathrooms()[place].rating;
    //   var comments = bathrooms()[place].comments;
    //   console.log(comments);
    //   var marker = new google.maps.Marker({
    //     position: position,
    //     title: title,
    //     features: features,
    //     rating: rating,
    //     animation: google.maps.Animation.DROP,
    //     id: place,
    //     comments: comments,
    //     icon: icons[bathrooms()[place].type].icon
    //   });
    //   markers.push(marker);
    //   marker.addListener('click', function() {
    //     populateInfoWindow(this, infoWindow);
    //   });
    // };

    // var bounds = new google.maps.LatLngBounds();
    // // Extend the boundaries of the map for each marker and display the marker
    // for (marker in markers) {
    //   markers[marker].setMap(map);
    //   //bounds.extend(markers[marker].position);
    // };
    //map.fitBounds(bounds);
  };

  this.hideListings = function() {
    for (marker in markers) {
      markers[marker].setMap(null);
    };
  };

  this.addBathroom = function() {
    bathrooms().push({title: 'Bacon Cafe', location: {lat: 47.66200, lng: -122.31346},
     features:
      {male: true, female: false, unisex: false, handycap: true,
      changingStation: true, free: true, cost: 0, withPurchase: false,
      publicRestRoom: true},
     rating: 4, type: 'restroom', comments: ['Always clean, but sometimes busy.']});
     showMarkers(bathrooms());
  };
};

ko.applyBindings(new ViewModel());
