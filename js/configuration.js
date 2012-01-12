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

// time until the camera popup closes
var camTime = 45000;

// time until the image popup closes
var picTime = 30000;

// Flags
var showAutoOnOffButton = true;
var useCam = false;
var showShowCam = true;

// Passat area
var passat_sw = new google.maps.LatLng(53.95871, 10.87989);
var passat_ne = new google.maps.LatLng(53.95992, 10.88286);

// text shown if no AIS data is available
var noAISDataInfo = "Momentan liegen keine aktuellen Schiffsinformationen vor!";

// text which will be shown if a certein piece of AIS data is not available
var noInfoText = "---";

// toggles between debuging and productive mode
var debugMode = false;
