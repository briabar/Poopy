var map;
var infoWindow;
var meMarker;
var pos = {};
var markers = [];
var onClickLatlng;
var icons = {
  restroom: {
    icon: 'img/toilet.jpg'
  },
  meMarker: {
    icon: 'img/me.png'
  }
}

function getBathrooms() {
  //This function exists as a placeholder for future database implementation.
  //Once database is implemented, changing out this function is trivial.
  var bathroomsDB = [
    {title: 'Sure Shot Cafe', location: {lat: 47.66148, lng: -122.31346},
     features:
      {male: true, female: false, unisex: false, handycap: true,
      changingStation: true, free: true, cost: 0, withPurchase: false,
      publicRestRoom: true},
     rating: 4, type: 'restroom', comments: ['Always clean, but sometimes busy.']},

  ];
  return bathroomsDB;
};

var bathrooms = getBathrooms();

function initMap() {
// Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6272037, lng: -122.3410009},
    zoom: 13,
    mapTypeControl: false
  });
  infoWindow = new google.maps.InfoWindow();
  google.maps.event.addListener(map, 'rightclick', function( event ){
    onClickLatlng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
    var clickMarker = new google.maps.Marker({
      position: onClickLatlng,
    });
    clickMarker.setMap(map);
    console.log(onClickLatlng);
  });
}; //END OF initMap()

//Function returns string of beautifully formatted bathroom features for infoWindow
function getFeatures(marker) {
  var brFeatures = "";
  brFeatures += "<input data-bind=\"click: addBathroom\" id=\"infoadd\" type=\"button\" value=\"Add Bathroom\">";
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
    isInfoWindowLoaded = false;
    google.maps.event.addListener(infoWindow, 'domready', function () {
      console.log($('#infoadd'));
      ko.cleanNode($('#infoadd'));
      if (!isInfoWindowLoaded) {
          ko.applyBindings(self, $('#infoadd')[0]);
          isInfoWindowLoaded = true;
      }
    });
      
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

function showMarkers(bathroomsArray) {
  for(place in bathrooms) {
    var position = bathrooms[place].location;
    var title = bathrooms[place].title;
    var features = bathrooms[place].features;
    var rating = bathrooms[place].rating;
    var comments = bathrooms[place].comments;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      features: features,
      rating: rating,
      animation: google.maps.Animation.DROP,
      id: place,
      comments: comments,
      icon: icons[bathrooms[place].type].icon
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
  self = this;

  self.showListings = function() {
    showMarkers(bathrooms);
  };

  self.hideListings = function() {
    for (marker in markers) {
      markers[marker].setMap(null);
    };
  };
  
  self.newTitle = ko.observable("horse");
  self.addBathroom = function() {
    console.log(self.newTitle());
    bathrooms.push({title: self.newTitle(), location: {lat: 47.66200, lng: -122.31346},
     features:
      {male: true, female: false, unisex: false, handycap: true,
      changingStation: true, free: true, cost: 0, withPurchase: false,
      publicRestRoom: true},
     rating: 4, type: 'restroom', comments: ['Always clean, but sometimes busy.']});
     showMarkers(bathrooms);
  };

  this.addMarker = function() {

  }
};

ko.applyBindings(new ViewModel());
