var markersArray = [];

var currentArea = 0;

var shownVessels = [];

var image = new Image();

var passatShip = {};

var picBox;


/**
 * Sets the current area
 * @param index - The index of the area to be set.
 */
function setCurrentArea(index) {

    // If the provided index does not match the current aea,
    // top the automatic mode (if it is set),
    // switch to the desired area and restart the automatic mode if it was set previously
    if (currentArea != index) {

        var elems = $("#radio input[type=radio]");
        if (index >= elems.length) {
            // start over again
            currentArea = 0;
            shownVessels = [];
        } else{
            currentArea = index;
        }

        // if the automatic mode is switched on, continue cycling the areas
        if ($('#on_off').attr('checked') == "checked") {
            $('#on_off').click();
            $('#on_off').click();
        }
    }
}


/**
 * Sort the provided markers from north to south based on the vessels GPS coordinates.
 * @param a - A marker
 * @param b - A marker
 * @return >0 if the first marker if placed farther north,
 *         <0 if it is the other way around and
 *         0 if there is no difference between the markers.
 */
function markerSortNS(a, b) {
    return Number(a.vessel.lat) - Number(b.vessel.lat);
}

/**
 * Sort the provided markers from west to east based on the vessels GPS coordinates.
 * @param a - A marker
 * @param b - A marker
 * @return >0 if the first marker if placed farther west,
 *         <0 if it is the other way around and
 *         0 if there is no difference between the markers.
 */
function markerSortWE(a, b) {
    return Number(a.vessel.lon) - Number(b.vessel.lon);
}


/**
 * Fetches available AIS data from a given source, creates markers based on the findings and calls a function after performing its tasks
 * @param source - the source of AIS data
 * @param callback  - Function to be called after (un-)successfully fetching the data
 */
function fetchData(source, callback) {
    downloadXml(url, function (data) {
        // since AIS data was etched successfully, the overlay warning
        // about the unavailability of AIS data is hidden
        $("#noAISDataOverlay").hide();
        console.log("AIS data was fetched successfully.");
        jQuery.extend(true, markersArray, refreshMarkers(data));
        callback();
    });
}

/**
 * Shows a map of an area of interest and returns all markers which are currently located in that area
 * @param index - The area of interest's index
 * @return All markers which are currently located in the area of interest.
 */
function showMapArea(index){
    var elems = $("#radio input[type=radio]");

    // create bounds object
    var lat_sw = parseFloat($(elems[index]).data("lat-sw"));
    var lon_sw = parseFloat($(elems[index]).data("long-sw"));
    var lat_ne = parseFloat($(elems[index]).data("lat-ne"));
    var lon_ne = parseFloat($(elems[index]).data("long-ne"));
    var sw = new google.maps.LatLng(lat_sw, lon_sw);
    var ne = new google.maps.LatLng(lat_ne, lon_ne);
    var bounds = new google.maps.LatLngBounds(sw, ne);

    // get markers in bound
    var markersInBound = [];
    $.each(markersArray, function (index, marker) {
        if (bounds.contains(marker.getPosition())) {
            markersInBound.push(marker);
        }
    });

    // Sort markers according to the course of the river Trave (roughly)
    if (index == 2) {
        markersInBound.sort(markerSortWE);
    } else {
        markersInBound.sort(markerSortNS);
    }

    // force unfocus of all elements
    for (var elem in elems) {
        elems.blur();
    }

    // there will be no need to programatically click the button
    // representing the provided area if it is already active
    if ($(elems[index]).attr('checked') != "checked") {
        $(elems[index]).trigger("click");
    }

    return markersInBound;
}


/**
 * Returns the (first) moving vessel which is currently in the camera-observed area or null, if no vessel is available.
 * @return The (first) moving vessel which is currently in the camera-observed area or null, if no vessel is available.
 */
function getVesselInCamArea() {
    var bounds = new google.maps.LatLngBounds(passat_sw, passat_ne);
    var vesselInBounds = 'undefined';

    $.each(markersArray, function (index, marker) {
        if (bounds.contains(marker.getPosition()) && marker.vessel.status == 'MOVING') {
            vesselInBounds = marker;
            // break for jquery each
            return false;
        }
    });

    if (vesselInBounds && vesselInBounds != 'undefined') {
        return vesselInBounds;
    } else {
        return null;
    }
}

/**
 * Opens a fancybox which shows a video stream or a static image of a vessel.
 * @param vessel - The vessel which image will be shown if no video stream is available
 */
function showCamOrImage(vessel) {
;

    if (useCam) {
        $('#show-cam').trigger('click');
    } else {
        // preload image and show picBox
        passatShip.image = $('<img />')
            .attr('src', 'http://images.vesseltracker.com/images/vessels/hires/-' + vessel.vessel.pic + '.jpg')
            .load(function () {
                passatShip.name = cnvrt2Upper(vessel.vessel.name);
                passatShip.type = translateType(vessel.vessel.type);
                picBox();
                // when not setting this timer, the image will not be loaded and the fancybox is
                window.setTimeout(function () {
                    $('#show-cam').trigger('click');
                }, 0);

            });

    }

}


/**
 * Called when the fancy box used to show a large image of a certain vessel or a video stream is closed
 */
function onCamOrImageBoxClose() {
    stopCamTimer();
    stopAutoModeTimer();
    if ($('#on_off').attr('checked') == "checked") {
        refreshMarkersAndCycleAreas(url);
    }
}
