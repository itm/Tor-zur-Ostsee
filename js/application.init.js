function initAutoOnOff(map, elems) {
    var kml = new google.maps.KmlLayer('http://itm.github.com/Tor-zur-Ostsee/region.kml');
    $('#on_off').attr('checked', 'checked');
    $('#on_off').iphoneStyle({
        checkedLabel : 'Auto',
        uncheckedLabel : 'Off',
        onChange : function(elem, value) {
            stopAutoModeTimer();
            // kml.setMap(map);
            if($(elem).attr('checked')) {
                refreshMarkersAndCycleAreas(url);
                kml.setMap(null);
                hideRegions(elems, map);
            } else {
                showRegions(elems, map);
            }
        }

    });
}


function initShowCam(map, callback) {

    $( "button#show-cam" ).css('font-size', '0.8em');
    $( "button#show-cam" ).button({
        icons: {
            primary: "ui-icon-video"
        },
        text: false
    });



    if ( useCam ) {
        var camBox = $( "button#show-cam" ).fancybox({
            'onStart' : function() {
                startCamTimer(camTime, function() { $.fancybox.close();	});
            },
            'onClosed': callback,
            'href' : '#data'
        });
    } else {

        if (debugMode){

            var camBox = $( "button#show-cam" ).fancybox({
                'onStart' : function() {
                    startCamTimer(picTime,function() { $.fancybox.close();});
                },
                'href' : '#big-image',
                'title': 'F&auml;hrt gerade an der Passat vorbei'
            });

        }else{
            picBox = function() {
                $( "button#show-cam" ).fancybox({
                    'onStart' : function() {
                        startCamTimer(picTime,function() { $.fancybox.close();});
                    },
                    'onClosed': callback,
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

/**
 * Initializes the radio buttons used to select the area of interest.
 * @param map A GoogleMap map which is placed directly below the buttons
 * @return The created and attached buttons
 */
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

        setCurrentArea(Number($(ev.target).attr("id").substr(5))-1);

    });

    return elems;
}
