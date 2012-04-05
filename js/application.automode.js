

/**
 * Fetches new AIS data from the given source and updates the markers based on the fetched data and starts cycling the various areas.
 * @param source AIS data source
 */
function refreshMarkersAndCycleAreas(source) {

    stopAutoModeTimer();

    fetchData(source, function(){
        var vesselInBounds = getVesselInCamArea();
        if (vesselInBounds != null) {

            infowindow.close();

            // if a vessel is found in the area observed by our web cam which was not displayed in the current iteration ...
            if ($.inArray(vesselInBounds.vessel.name, shownVessels) == "-1") {
                // ... mark it as shown and show its video stream or image
                shownVessels.push(vesselInBounds.vessel.name);
                showCamOrImage(vesselInBounds);
                return;
            }
        }

        // fetch all markers of vessels located in the current area of interest and display the area.
        var availableMarkers = showMapArea(currentArea);

        showArea(currentArea, availableMarkers,function(){
            stopAutoModeTimer();
            setCurrentArea(currentArea+1);
            refreshMarkersAndCycleAreas(source);
        });

    });

}

/**
 * Shows detailed information about all vessels in an area of interest.<br/>
 * If no vessels are in the area of interest, or all vessels have been processed, the next area is processed.
 * @param curArea - Index of the current area of interest
 * @param markersInBound - A collection of markers located in the area of interest.
 */
function showArea(curArea,markersInBound, callback) {

    // if no marker in bounds
    if (markersInBound.length == 0) {
        // skip
        startAutoModeTimer(noVesselTime, function () {
            callback();
        });
    } else {
        // before focusing on a vessel, the map within its original bounds is shown
        startAutoModeTimer(showAreaTime, function () {
            waitAndShow(0, curArea, markersInBound,callback);
        });
    }
}


/**
 * Focuses on each vessel found in a certain area one after another and opens information windows for each.
 * The switching frequency depends on configurable timeouts for focusing on a vessel and showing the information window.
 * @param index - The index of the vessel to be processed at this time
 * @param curArea  - The index of the area the vessels are located in
 * @param markers - A collection of markers representing the current vessels
 * @param callback - Function to be called if all vessels have been processed
 */
function waitAndShow(index, curArea, markers, callback) {

    infowindow.close();

    if (index < markers.length){

        map.panTo(markers[index].getPosition());
        map.panBy(0, -200);

        startAutoModeTimer(pauseTime, function () {
            google.maps.event.trigger(markers[index++], 'click');
            startAutoModeTimer(infoTime, function () {
                waitAndShow(index, curArea, markers, callback);
            });
        });

    } else{
        callback();
    }
}