
var downloadXml = function(url, callback) {
	
	$.ajax({
      type: "GET",
			url: url,
			dataType: "xml",
			success: callback,
			error:function (xhr, ajaxOptions, thrownError){
					var $noDataDialog = $('<div></div>')
						.html(noAISDataInfo)
						.dialog({
							autoOpen: true,
							title: 'Fehler beim Laden der Daten',
							resizable: false,
							show: 'fade',
							hide: 'explode',
							modal: true
						});

					setTimeout(function(){$noDataDialog.dialog("close")},5000);
				   
					//if there are still markers available, the warning about
					// the unavailability of new data will lead to confusions
					if (markersArray == null || markersArray.length == 0){
					$("#noAISDataOverlay").show();
					}
					console.log("fail");
                  
			}    
	});	
}

var parseXml = function(xmlDoc) {

	var vesselinfo = new Array();

	$(xmlDoc).find('marker').each(function(){
 		var vessel = new Object();
		vessel.status 		= this.getAttribute("status");
		vessel.name 		= this.getAttribute("name");
		vessel.icon			= this.getAttribute("icon");
		vessel.imo 			= this.getAttribute("imo");
		vessel.mmsi 		= this.getAttribute("mmsi");
		vessel.call 		= this.getAttribute("call");
		vessel.type 		= this.getAttribute("t");
		vessel.lat 			= this.getAttribute("lat");
		vessel.lon 			= this.getAttribute("lng");
		vessel.lastlat		= this.getAttribute("last_lat");
		vessel.lastlon		= this.getAttribute("last_lon");
		vessel.heading 		= this.getAttribute("th");
		vessel.shipId 		= this.getAttribute("id");
		vessel.course 		= this.getAttribute("cog");
		vessel.width 		= this.getAttribute("width");
		vessel.length 		= this.getAttribute("length");
		vessel.left 		= this.getAttribute("left");
		vessel.front 		= this.getAttribute("front");
		vessel.nationality	= this.getAttribute("country");
		vessel.flagid 		= this.getAttribute("flag");
		vessel.speed 		= ((this.getAttribute("speed")==null)?"0":this.getAttribute("speed"));
		vessel.pic 			= this.getAttribute("p");
		vessel.lastSeen 	= this.getAttribute("last_seen");
		vessel.draught		= this.getAttribute("draught");
		vessel.pod			= this.getAttribute("destination");
		vessel.eta			= this.getAttribute("eta");

		vesselinfo.push(vessel);
	});

	return vesselinfo;
}
