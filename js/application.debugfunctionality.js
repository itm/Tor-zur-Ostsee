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
