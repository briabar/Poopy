var map;
var outMap;
var infoWindow;
var meMarker;
var pos = {};
var markers = [];
var clickMarker;
var clickMarkerPosition;
var onClickLatlng;
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
}; //END OF initMap()

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
  var arrayToClear = [];
  self = this;

  self.mapBind = function() {
    clickMarker = new google.maps.Marker();
    //keep event handlers from piling up
    google.maps.event.clearInstanceListeners(map);
    map.addListener('click', function() {
      infoWindow.close();
      console.log("butts");
      //clean up markers
      for (item in arrayToClear) {
       arrayToClear[item].setMap(null);
      };
      clickMarker.setMap(null);
    });
    var listener = map.addListener('rightclick', function( event ){
      //clean up markers
      for (item in arrayToClear) {
        arrayToClear[item].setMap(null);
      };
      clickMarker.setMap(null);
      var onClickLatlng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
      clickMarker = new google.maps.Marker({
        position: onClickLatlng,
        icon: 'img/toilet.jpg'
      });
      clickMarker.setMap(map);
      arrayToClear.push(clickMarker);
      infoWindow.close();
      infoWindow.setContent("<input data-bind=\"value: newName\" id=\"nameadd\" placeholder=\"venue name\"><div>"
      + "  Male: <input type=\"radio\" data-bind=\"checked: newMale\" id=\"maleadd\" name=\"gender\">"
      + "  Female: <input type=\"radio\" data-bind=\"checked: newFemale\" id=\"femaleadd\" name=\"gender\">"
      + "  Unisex: <input type=\"radio\" data-bind=\"checked: newUnisex\" id=\"unisexadd\" name=\"gender\"><br>"
      + "  Handycap: <input type=\"checkbox\" data-bind=\"checked: newHandycap\" id=\"handycapadd\">"
      + " Changing Station:<input type=\"checkbox\" data-bind=\"checked: newChangingStation\" id=\"changingstationadd\"><br>"
      + " Free to use: <input type=\"checkbox\" data-bind=\"checked: newFree\" id=\"freeadd\"><br>"
      + "<input data-bind=\"value: newCost, visible: !newFree()\" placeholder=\"Price to use.\" id=\"costadd\"></div><br>"
      + "  1: <input type=\"radio\" value=\"1\" data-bind=\"checked: newRating\" id=\"1add\" name=\"rating\">"
      + "  2: <input type=\"radio\" value=\"2\" data-bind=\"checked: newRating\" id=\"2add\" name=\"rating\">"
      + "  3: <input type=\"radio\" value=\"3\" data-bind=\"checked: newRating\" id=\"3add\" name=\"rating\">"
      + "  4: <input type=\"radio\" value=\"4\" data-bind=\"checked: newRating\" id=\"4add\" name=\"rating\">"
      + "  3: <input type=\"radio\" value=\"5\" data-bind=\"checked: newRating\" id=\"5add\" name=\"rating\"><br>"
      + "<input data-bind=\"value: newComment\" placeholder=\"Write a comment.\" id=\"comment\">"
      + "<input data-bind=\"click: addBathroom\" id=\"infoadd\" type=\"button\" value=\"Add Bathroom\">");
      clickMarkerPosition = clickMarker.position;
      infoWindow.open(map, clickMarker);
      isInfoWindowLoaded = false;
      //remove and reapply bindings to infoWindow
      google.maps.event.addListener(infoWindow, 'domready', function () {
        $(".gm-style-iw").next("div").hide();
        ko.cleanNode($('#nameadd'));
        ko.cleanNode($('#maleadd'));
        ko.cleanNode($('#femaleadd'));
        ko.cleanNode($('#unisexadd'));
        ko.cleanNode($('#handycapadd'));
        ko.cleanNode($('#changingstationadd'));
        ko.cleanNode($('#freeadd'));
        ko.cleanNode($('#showcost'));
        ko.cleanNode($('#costadd'));
        ko.cleanNode($('#1add'));
        ko.cleanNode($('#2add'));
        ko.cleanNode($('#3add'));
        ko.cleanNode($('#4add'));
        ko.cleanNode($('#5add'));
        ko.cleanNode($('#comment'));
        ko.cleanNode($('#infoadd'));
        if (!isInfoWindowLoaded) {
          ko.applyBindings(self, $('#nameadd')[0]);
          ko.applyBindings(self, $('#maleadd')[0]);
          ko.applyBindings(self, $('#femaleadd')[0]);
          ko.applyBindings(self, $('#unisexadd')[0]);
          ko.applyBindings(self, $('#handycapadd')[0]);
          ko.applyBindings(self, $('#changingstationadd')[0]);
          ko.applyBindings(self, $('#freeadd')[0]);
          ko.applyBindings(self, $('#costadd')[0]);
          ko.applyBindings(self, $('#1add')[0]);
          ko.applyBindings(self, $('#2add')[0]);
          ko.applyBindings(self, $('#3add')[0]);
          ko.applyBindings(self, $('#4add')[0]);
          ko.applyBindings(self, $('#5add')[0]);
          ko.applyBindings(self, $('#comment')[0]);            
          ko.applyBindings(self, $('#infoadd')[0]);
          isInfoWindowLoaded = true;
        }
      });
    }, false);
  };
  // console.log(map);
 


  self.showListings = function() {
    showMarkers(bathrooms);
  };

  self.hideListings = function() {
    for (marker in markers) {
      markers[marker].setMap(null);
    };
  };
  
  self.newName = ko.observable();
  self.newMale = ko.observable();
  self.newFemale = ko.observable();
  self.newUnisex = ko.observable();
  self.newHandycap = ko.observable();
  self.newChangingStation = ko.observable();
  self.newFree = ko.observable();
  self.newCost = ko.observable();
  self.newWithPurchase = ko.observable();
  self.newPublic = ko.observable();
  self.newRating = ko.observable();
  self.newComment = ko.observable();
  self.addBathroom = function() {
    console.log("clickMarker");
    console.log(clickMarker);
    bathrooms.push({title: self.newName(), location: clickMarkerPosition,
     features:
      {male: self.newMale(), female: self.newFemale(), unisex: self.newUnisex(), handycap: self.newHandycap(),
      changingStation: self.newChangingStation(), free: self.newFree(), cost: self.newCost(), withPurchase: self.newWithPurchase(),
      publicRestRoom: self.newPublic()},
     rating: self.newRating(), type: 'restroom', comments: [self.newComment()]});
     infoWindow.close()
     showMarkers(bathrooms);
     self.newName = ko.observable();
     self.newMale = ko.observable();
     self.newFemale = ko.observable();
     self.newUnisex = ko.observable();
     self.newHandycap = ko.observable();
     self.newChangingStation = ko.observable();
     self.newFree = ko.observable();
     self.newCost = ko.observable();
     self.newWithPurchase = ko.observable();
     self.newPublic = ko.observable();
     self.newRating = ko.observable();
     self.newComment = ko.observable();
  };

  this.addMarker = function() {

  }
};

ko.applyBindings(new ViewModel());
