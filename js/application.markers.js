/**
 * Removes all data on the current of the global variable 'markersArray' and removes all elements from the map
 */
function clearMarker(arr) {
    $.each(arr, function(index, marker) {
        marker.setMap(null);
    });
    arr.splice(0,arr.length);
}

/**
 * Refreshes the markers placed on the map based on the provided data<br/>
 * All old markers will be removed and all new ones will be placed on the map
 * @param data - AIS data
 */
function refreshMarkers(data) {

    // remove all currently visible markers
    clearMarker(markersArray);

    // parse the AIS data to extract the vessels
    var vessels = parseXml(data);

    // create and return GoogleMaps markers for each of the extracted vessels
    jQuery.extend(true, markersArray, convertToGoogleMarkers(map,vessels));

}


/**
 * Returns an array GoogleMaps markers based on the provided vessels
 * @param map - The map the markers are placed on
 * @param vessel - The vessels the marker reflect
 * @return - An array GoogleMaps markers based on the provided vessels
 */
function convertToGoogleMarkers(map, vessels){
    var googleMarkers = [];
    $(vessels).each(function () {
        var marker = convertToGoogleMarker(map, this);
        googleMarkers.push(marker);
    });

    console.log("Add markers to map");

    return googleMarkers;
}

/**
 * Returns a GoogleMaps marker based on the provided vessel
 * @param map - The map the marker is placed on
 * @param vessel - The vessel the marker reflects
 * @return - A GoogleMaps marker based on the provided vessel
 */
function convertToGoogleMarker( map, vessel){
    // Sample custom marker code created with Google Map Custom Marker Maker
    // http://www.powerhut.co.uk/googlemaps/custom_markers.php
    // marker images taken from or inspired by http://mapicons.nicolasmollet.com/markers/

    var image = new google.maps.MarkerImage(getMarkerImage(vessel), new google.maps.Size(32, 37), new google.maps.Point(0, 0), new google.maps.Point(16, 37));
    var shadow = new google.maps.MarkerImage('img/shadow.png', new google.maps.Size(54, 37), new google.maps.Point(0, 0), new google.maps.Point(16, 37));
    var shape = {
        coord : [29, 0, 30, 1, 31, 2, 31, 3, 31, 4, 31, 5, 31, 6, 31, 7, 31, 8, 31, 9, 31, 10, 31, 11, 31, 12, 31, 13, 31, 14, 31, 15, 31, 16, 31, 17, 31, 18, 31, 19, 31, 20, 31, 21, 31, 22, 31, 23, 31, 24, 31, 25, 31, 26, 31, 27, 31, 28, 31, 29, 30, 30, 29, 31, 23, 32, 22, 33, 21, 34, 20, 35, 19, 36, 12, 36, 11, 35, 10, 34, 9, 33, 8, 32, 2, 31, 1, 30, 0, 29, 0, 28, 0, 27, 0, 26, 0, 25, 0, 24, 0, 23, 0, 22, 0, 21, 0, 20, 0, 19, 0, 18, 0, 17, 0, 16, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 1, 1, 2, 0, 29, 0],
        type : 'poly'
    };

    // create a google maps marker
    var marker = new google.maps.Marker({
        icon: image,
        shadow: shadow,
        shape: shape,
        position : new google.maps.LatLng(vessel.lat, vessel.lon),
        map : map
    });

    marker.vessel = vessel;

    google.maps.event.addListener(marker, 'click', function () {
        content = createMarkerContent(this.vessel);
        infowindow.setContent(content);
        infowindow.open(map, this);
    });


    return marker;
}

