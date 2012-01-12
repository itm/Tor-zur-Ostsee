// path/url to vessel data
var url = 'xml/data.xml';
			
// timout at the very start of the app
var timerTimeout = 2000;

// time the infoWindow is shown
var infoTime = 3000;

// time spent on a ship focused until the infowindow pops up
var pauseTime = 1000;

// time to stay at a viewport if no ships are present
var noVesselTime = 4000;

// time until the camera/image popup closes
var camTime = 5000;

// Flags
var showAutoOnOffButton = true;
var useCam = false;
var showShowCam = true;

// Passat area
var passat_sw = new google.maps.LatLng(53.95871, 10.87989);
var passat_ne = new google.maps.LatLng(53.95992, 10.88286);
