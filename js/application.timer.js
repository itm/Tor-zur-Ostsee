/**
 * Stops the timer which automatically switches between
 * the maps and opens the tooltip windows which provide
 * information about the dispayed vessels.
 */
function stopAutoModeTimer(){
    $("#on_off").stopTime("cycling");
}

/**
 * Starts the timer which automatically switches between
 * the maps and opens the tooltip windows which provide
 * information about the dispayed vessels.
 * The mentioned functionality is provided as a call-back function.
 *
 * All timers which were previously started for this purpose are
 * stopped first to make sure that they do not interfere. The same
 * holds for the timer which is responible for displaying the camera's
 * view for a certain amount of time.
 * @param delay time to wait before calling the provided callback function.
 * @param callback A function which provides some kind of functionality
 */
function startAutoModeTimer(delay, callback){
    stopAutoModeTimer();
    stopCamTimer();
    $("#on_off").oneTime(delay, "cycling", callback);
}


/**
 * Stops the timer which is responible for displaying the camera's
 * view for a certain amount of time.
 */
function stopCamTimer(){
    $("#on_off").stopTime("showCamOrImage");
}

/**
 * Starts the timer which is responible for displaying the camera's
 * view for a certain amount of time.
 *
 * All timers which were previously started for this purpose are
 * stopped first to make sure that they do not interfere. The same
 * holds for the timer which automatically switches between
 * the maps and opens the tooltip windows which provide
 * information about the dispayed vessels.
 * @param delay time to wait before calling the provided callback function.
 * @param callback A function which provides some kind of functionality
 */
function startCamTimer(delay, callback){
    stopAutoModeTimer();
    stopCamTimer();
    $("#on_off").oneTime(delay, "showCamOrImage", callback);
}
