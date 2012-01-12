
var markersArray = [];

var currentArea = 0;

var shownVessels = [];

var image = new Image();

var passatShip = {};

var picBox;

function addMarker(location, map, vessel) {

	// Sample custom marker code created with Google Map Custom Marker Maker
	// http://www.powerhut.co.uk/googlemaps/custom_markers.php
	// marker images taken from or inspired by http://mapicons.nicolasmollet.com/markers/

	var image = new google.maps.MarkerImage(getMarkerImage(vessel), new google.maps.Size(32, 37), new google.maps.Point(0, 0), new google.maps.Point(16, 37));
	var shadow = new google.maps.MarkerImage('img/shadow.png', new google.maps.Size(54, 37), new google.maps.Point(0, 0), new google.maps.Point(16, 37));
	var shape = {
		coord : [29, 0, 30, 1, 31, 2, 31, 3, 31, 4, 31, 5, 31, 6, 31, 7, 31, 8, 31, 9, 31, 10, 31, 11, 31, 12, 31, 13, 31, 14, 31, 15, 31, 16, 31, 17, 31, 18, 31, 19, 31, 20, 31, 21, 31, 22, 31, 23, 31, 24, 31, 25, 31, 26, 31, 27, 31, 28, 31, 29, 30, 30, 29, 31, 23, 32, 22, 33, 21, 34, 20, 35, 19, 36, 12, 36, 11, 35, 10, 34, 9, 33, 8, 32, 2, 31, 1, 30, 0, 29, 0, 28, 0, 27, 0, 26, 0, 25, 0, 24, 0, 23, 0, 22, 0, 21, 0, 20, 0, 19, 0, 18, 0, 17, 0, 16, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 1, 1, 2, 0, 29, 0],
		type : 'poly'
	};

	var marker = new google.maps.Marker({
		icon: image,
		shadow: shadow,
		shape: shape,
		position : location,
		map : map
	});
	markersArray.push(marker);
	return marker;
};

function markerSortNS (a, b) {
	return Number(a.vessel.lat) - Number(b.vessel.lat);
}

function markerSortWO (a, b) {
	return Number(a.vessel.lon) - Number(b.vessel.lon);
}

function showMarkersInArea(index, curArea, markers) {
	var content = createMarkerContent(markers[index].vessel);
	infowindow.setContent(content);
	infowindow.open(map, markers[index]);
	index++;
	if ( index < markers.length ) {
		$("#on_off").oneTime(infoTime, "cycling", function() {waitAndShow(index, curArea, markers);});
	} else {
		// next viewport
		$("#on_off").oneTime(infoTime, "cycling", function() {cycleAreas(curArea+1);});
	}
} 

function cycleAreas(curArea) {
	var elems = $("#radio input[type=radio]");
	refreshMarker(url);
	if ( curArea >= elems.length ) {
		// start over again
		curArea = 0;
		shownVessels = [];
	}
	// create bounds object
	var lat_sw = parseFloat($(elems[curArea]).data("lat-sw"));
	var lon_sw = parseFloat($(elems[curArea]).data("long-sw"));
	var lat_ne = parseFloat($(elems[curArea]).data("lat-ne"));
	var lon_ne = parseFloat($(elems[curArea]).data("long-ne"));
	var sw = new google.maps.LatLng(lat_sw, lon_sw);
	var ne = new google.maps.LatLng(lat_ne, lon_ne);
	var bounds = new google.maps.LatLngBounds(sw, ne);
	
	// get markers in bound
	var markersInBound = [];
	$.each(markersArray, function(index, marker) {
		if ( bounds.contains(marker.getPosition()) ) {
			markersInBound.push(marker);
		}
	});
	
	// Sort markers accorting to the course of the river Trave (roughly)
	if (curArea == 2){
		markersInBound.sort(markerSortWO);
	}else{
		markersInBound.sort(markerSortNS);
	}
	
	infowindow.close();
	
	// force unfocus of all elements
	for (var elem in elems){
		elems.blur();
	}
	
	$(elems[curArea]).trigger("click");
	// if no marker in bounds
	if ( markersInBound.length == 0 ) {
		// skip
		$("#on_off").oneTime(noVesselTime, "cycling", function() {cycleAreas(curArea + 1);});
	} else {
		$("#on_off").oneTime(pauseTime, "cycling", function() {waitAndShow(0, curArea, markersInBound);});
	}
}

function waitAndShow(index, curArea, markers) {
	infowindow.close();
	$("#on_off").oneTime(pauseTime, "cycling", function() {showMarkersInArea(index, curArea, markers);});
	map.panTo(markers[index].getPosition());
	map.panBy(0, -200);
}


var regionOverlays = [];
function showRegions(elems, map) {

	$(elems).each( function() {

		var rect = [
			new google.maps.LatLng( $(this).data('lat-sw'), $(this).data('long-ne') ),
			new google.maps.LatLng( $(this).data('lat-ne'), $(this).data('long-ne') ),
			new google.maps.LatLng( $(this).data('lat-ne'), $(this).data('long-sw') ),
			new google.maps.LatLng( $(this).data('lat-sw'), $(this).data('long-sw') ),
			new google.maps.LatLng( $(this).data('lat-sw'), $(this).data('long-ne') )
		]; 
		var poly = new google.maps.Polyline({
			path : rect,
			strokeColor: "#FF0000",
		  strokeOpacity: 1.0,
		  strokeWeight: 2
		});
		poly.setMap(map);
		regionOverlays.push(poly);
	});
	
	// Passat area
	var rect = [
		new google.maps.LatLng( passat_sw.lat(), passat_ne.lng() ),
		new google.maps.LatLng( passat_ne.lat(), passat_ne.lng() ),
		new google.maps.LatLng( passat_ne.lat(), passat_sw.lng() ),
		new google.maps.LatLng( passat_sw.lat(), passat_sw.lng() ),
		new google.maps.LatLng( passat_sw.lat(), passat_ne.lng() )
	]; 
	var poly = new google.maps.Polyline({
		path : rect
	});
	poly.setMap(map);
	regionOverlays.push(poly);
}

function hideRegions(elems, map) {
	$.each(regionOverlays, function() {
		this.setMap(null);
	});
}

function initAutoOnOff(map, elems) {
	var kml = new google.maps.KmlLayer('http://itm.github.com/Tor-zur-Ostsee/region.kml');
	$('#on_off').attr('checked', 'checked');
	$('#on_off').iphoneStyle({
		checkedLabel : 'Auto',
		uncheckedLabel : 'Off',
		onChange : function(elem, value) {
			$("#on_off").stopTime("cycling");
			// kml.setMap(map);
			if($(elem).attr('checked')) {
				cycleAreas(currentArea);
				kml.setMap(null);
				hideRegions(elems, map);
			} else {
				showRegions(elems, map);				
			}
		}
	});
}


function initShowCam(map) {
	
	$( "button#show-cam" ).css('font-size', '0.8em');
	$( "button#show-cam" ).button({
      icons: {
          primary: "ui-icon-video"
      },
      text: false
  	});
		
	var restart = function(){ 
			$("#on_off").stopTime("showCamOrImage");
			cycleAreas(currentArea);
		};
	
	if ( useCam ) {
		var camBox = $( "button#show-cam" ).fancybox({
			'onStart' : function() {
					$("#on_off").stopTime("cycling");
					$("#on_off").oneTime(infoTime, "showCamOrImage", function() {
							$.fancybox.close();
						}, camTime)
			},
			'onClosed': restart,
			'href' : '#data'
		});
	} else {
		
		if (debugMode){
		
			var camBox = $( "button#show-cam" ).fancybox({
				'onStart' : function() {
						$("#on_off").stopTime("cycling");
						$("#on_off").oneTime(infoTime, "showCamOrImage", function() {
								$.fancybox.close();
							}, picTime)
					},
				'href' : '#big-image',
				'title': 'F&auml;hrt gerade an der Passat vorbei'
			});
			
		}else{
			picBox = function() {
				$( "button#show-cam" ).fancybox({
						'onStart' : function() {
								$("#on_off").stopTime("cycling");
								$("#on_off").oneTime(infoTime, "showCamOrImage", function() {
										$.fancybox.close();
									}, picTime)
							},
						'onClosed': restart,
						'content' : passatShip.image,
						'title': 'F&auml;hrt gerade an der Passat vorbei: ' +
											passatShip.name +
											' (' + passatShip.type +')'
					});
			}
		}
	}
}

function initMap() {
	var myOptions = {
		zoom : 14,
		center : new google.maps.LatLng(53.890582, 10.701184),
		mapTypeId : google.maps.MapTypeId.TERRAIN,
		disableDefaultUI: true
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	// add Logo
	var logoDiv = document.createElement('DIV');
	$(logoDiv).html('<img alt="logo" src="img/logo.png" />');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(logoDiv);
	
	// add an area to show a warning in case that no AIS data is available
	$("#noAISDataOverlay").hide();
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById("noAISDataOverlay"));
	
	return map;
}

function initButtons(map) {
	$("#radio form").buttonset();
	var elems = $("#radio input[type=radio]");
	elems.click(function(ev) {
		var lat_sw = parseFloat($(ev.target).data("lat-sw"));
		var lon_sw = parseFloat($(ev.target).data("long-sw"));
		var lat_ne = parseFloat($(ev.target).data("lat-ne"));
		var lon_ne = parseFloat($(ev.target).data("long-ne"));
		var sw = new google.maps.LatLng(lat_sw, lon_sw);
		var ne = new google.maps.LatLng(lat_ne, lon_ne);
		var bounds = new google.maps.LatLngBounds(sw, ne);
		map.fitBounds(bounds);
		currentArea = Number($(ev.target).attr("id").substr(5))-1;
	});
  
	return elems;
}

function clearMarker() {
	$.each(markersArray, function(index, marker) {
		marker.setMap(null);
	});
	markersArray= [];
}

function refreshMarker(url) {
	downloadXml(url, function(data) {
		// since AIS data was etched successfully, the overlay warning
		// about the unavailability of AIS data is hidden
		$("#noAISDataOverlay").hide();
		console.log("AIS data was fetched successfully.");
		clearMarker();
		var vessels = parseXml(data);
		$(vessels).each(function() {
			var marker = addMarker(new google.maps.LatLng(this.lat, this.lon), map, this);
			marker.vessel = this;
			google.maps.event.addListener(marker, 'click', function() {
				content = createMarkerContent(this.vessel);
				infowindow.setContent(content);
				infowindow.open(map, this);
			});
		});
		checkIfPassatIsPassed();
	});
}


function checkIfPassatIsPassed() {
	var bounds = new google.maps.LatLngBounds(passat_sw, passat_ne);
	var vesselInBounds = 'undefined';
	
	$.each(markersArray, function(index, marker) {
		if ( bounds.contains(marker.getPosition()) && marker.vessel.status == 'MOVING' ) {
			vesselInBounds = marker;
			// break fopassatShipry each
			return false;
		}
	});
	
	if ( !vesselInBounds || 'undefined'==vesselInBounds )
		return;

	if ($.inArray(vesselInBounds.vessel.name,shownVessels) == "-1"){
		shownVessels.push(vesselInBounds.vessel.name);
		showCamOrImage(vesselInBounds);
	}

}

function showCamOrImage(ship){
		
	var restart = function(){ cycleAreas(currentArea); };
	// stop cycling
	$("#on_off").stopTime("cycling");

	if ( useCam ) {
		$('#show-cam').trigger('click');
	} else {
		// preload image and show picBox
		passatShip.image = $('<img />')
			.attr('src', 'http://images.vesseltracker.com/images/vessels/hires/-'+ship.vessel.pic+'.jpg')
			.load(function(){
 					passatShip.name = cnvrt2Upper(ship.vessel.name);
 					passatShip.type = translateType(ship.vessel.type);
 					picBox();
 					// when not setting this timer, the image will not be loaded and the fancybox is
					window.setTimeout(function(){$('#show-cam').trigger('click');},0);

		});
    
	}
	
	
}