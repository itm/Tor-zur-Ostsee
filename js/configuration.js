// path/url to vessel data
var url = 'xml/data.xml';

var picSrc = 'http://images.vesseltracker.com/images/vessels/small/';
var picHref = 'http://www.vesseltracker.com/de/ShipPhotos/';
var flagSrc = 'http://images.vesseltracker.com/images/flags/';
			
// timout at the very start of the app
var timerTimeout = 2000;

// time the infoWindow is shown
var infoTime = 16000;

// time spent on a ship focused until the infowindow pops up
var pauseTime = 4000;

// time to stay at a viewport if no ships are present
var noVesselTime = 8000;

// time until the camera/image popup closes
var camTime = 30000;

// Flags
var showAutoOnOffButton = true;
var useCam = false;
var showShowCam = true;

// Passat area
var passat_sw = new google.maps.LatLng(53.95871, 10.87989);
var passat_ne = new google.maps.LatLng(53.95992, 10.88286);
