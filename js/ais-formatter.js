var translations = new Array();

// states
translations["MOORED"] = "angelegt";
translations["MOVING"] = "fahrend";
translations["WAITING"] = "wartend";
translations["ANCHORAGE"] = "vor Anker";
translations["UNKNOWN"] = "unbekannt";

// types
translations["cargo\_ships"] = "Frachtschiff";
translations["tankships"] = "Tanker";
translations["coast\_guard\_ships"] = "K&uuml;stenwache";
translations["passenger\_ships"] = "Passagierschiff";
translations["sailing\_vessels"] = "Segelschiff";
translations["pilot\_vessels"] = "Lotsenschiff";
translations["tugboats"] = "Schlepper";
translations["anti-pollution\_vessels"] = "Schadstoffbek&auml;mpfung";
translations["pleasure\_crafts"] = "Sportboot";
translations["high-speed\_crafts"] = "Schnellboot";
translations["dredgers"] = "Bagger";
translations["fishing\_boats"] = "Fischfangboot";
translations["rescue\_vessels"] = "SAR-Schiff";
translations["towing\_vessels"] = "Schlepper";
//translations["ekranoplans"] = "Bodeneffektfahrzeug";
translations["others"] = "Sonstiges Schiff";


var translateType = function(ais_description) {
	
    if (!$.inArray(ais_description, translations)){
		ais_description = "others";
	}
	return translations[ais_description];
}

var translateStatus = function(ais_description) {
	
    if (!$.inArray(ais_description, translations)){
		ais_description = "UNKNOWN";
	}
	return translations[ais_description];
}



var getMarkerImage = function(vessel) {
	var result = 'img/';

	switch(vessel.type) {
		case 'cargo\_ships':
			result += 'cargoship';
			break;
		case 'tankships':
			result += 'tankship';
			break;
		case 'coast\_guard\_ships':
			result += 'coastguardship';
			break;
		case 'passenger\_ships':
			result += 'passengership';
			break;
		case 'sailing\_vessels':
			result += 'sailingship';
			break;
		case 'fishing\_boats':
			result += 'fishingship';
			break;	
		default:
			result += 'othership';
	}

	if(!(vessel.status=='MOVING')){
		result+='_a';
	}
	
	result +='.png';
	return result;
}


var cnvrt2Upper = function (str) {
	return str.toLowerCase().replace(/\b[a-z]/g, cnvrt);
	function cnvrt() {
		return arguments[0].toUpperCase();
	}
}

var createMarkerContent = function(vesselinfo) {

	var direction = new Array();
	direction["7"] = "NW";
	direction["8"] = "N";
	direction["9"] = "N0";
	direction["6"] = "0";
	direction["3"] = "SO";
	direction["2"] = "S";
	direction["1"] = "SW";
	direction["4"] = "W";
	direction["5"] = "unbekannt";
	
	
	// get optional content
	var description = new Object();	
	
	if (vesselinfo.draught != null){
		description.draught = "<dt>Tiefgang</dt><dd>"+vesselinfo.draught+"</dd>";
	}else{
		description.draught = "";
	}
	
	if (vesselinfo.pod != null){
		description.pod = "<dt>Zielhafen</dt><dd>"+vesselinfo.pod+"</dd>";
	}else{
		description.pod = "";
	}
	
	
	if (vesselinfo.pic != null){
        	description.pic = "	<a href='http://www.vesseltracker.com/de/ShipPhotos/" +vesselinfo.pic+".html'>"+
									"<img  id='zentriert' border='0' src='http://images.vesseltracker.com/images/vessels/thumbnails/" + 
									vesselinfo.pic +".jpg' alt='click image to get larger ship picture'/>"+
        						"</a>";
	}else{
		description.pic="";
	}
	
	
	
	content = 
       	"<div class='container'>"+
       	"<div class='flag'>"+
		"<img src='http://images.vesseltracker.com/images/flags/"+ vesselinfo.flagid +".png'/> "+
		"</div>" +      	
       	" <div class='vesselname'>"+ cnvrt2Upper(vesselinfo.name)+ "</div>" + translateType(vesselinfo.type) +       	
       	"<dl class='table-display'>"+
       	description.pic+   
    	"<dt>L&auml;nge x Breite</dt>"+
    	"<dd>"+ Math.round(vesselinfo.length) + "m x " + Math.round(vesselinfo.width)+"m</dd>"+
    	"<dt>Status</dt>"+
    	"<dd>"+translateStatus(vesselinfo.status)+"</dd>"+
    	"<dt>Geschwindigkeit</dt>"+
    	"<dd>"+vesselinfo.speed+"kn</dd>"+
    	"<dt>Kurs / Richtung</dt>"+
    	"<dd>"+vesselinfo.course+"&deg; / "+ direction[vesselinfo.icon]+"</dd>"+
    	description.draught+
    	description.pod+
    	"</dl>"+
    	"</div>";

	//console.log(content);
	return content;
};
