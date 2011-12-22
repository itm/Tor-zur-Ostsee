
var markersArray = [];

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
		map : map,
	});
	markersArray.push(marker);
	return marker;
};


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
		  strokeWeight: 2,
		});
		poly.setMap(map);
		regionOverlays.push(poly);
	});
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
			window.clearInterval(myTimer);
			// kml.setMap(map);
			if($(elem).attr('checked')) {
				myTimer = cycleAreas(0);
				kml.setMap(null);
				hideRegions(elems, map);
			} else {
				showRegions(elems, map);				
			}
		}
	});
}

function startCycling(elems) {
	// trigger click with next on timer
	var i = 0;
	var changeCenter = function() {
		i++;
		if(i >= elems.size()) {
			i = 0;
		}
		$(elems[i]).trigger("click");
	};
	return window.setInterval(changeCenter, 10000);
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
	});
	
	$( "button#show-cam" ).css('font-size', '0.8em');
	$( "button#show-cam" ).button({
      icons: {
          primary: "ui-icon-video"
      },
      text: false
  });
	var camBox = $( "button#show-cam" ).fancybox({
		'onStart' : function() {
				window.setTimeout(function() {
					$.fancybox.close();
				}, 30000)
			},
		'href' : '#data'
	});
  
	return elems;
}

function refreshMarker(infowindow, map, url) {
	downloadXml(url, function(data) {
		var vessels = parseXml(data);
		// TODO I think we have to clear all previous markers here
		$(vessels).each(function() {
			var marker = addMarker(new google.maps.LatLng(this.lat, this.lon), map, this);
			marker.vessel = this;
			google.maps.event.addListener(marker, 'click', function() {
				content = createMarkerContent(this.vessel);
				infowindow.setContent(content);
				infowindow.open(map, this);
			});
		});
	});
}

