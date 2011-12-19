var translate = function(ais_description) {

	var translations = new Array();

	// states
	translations["MOORED"] = "angelegt";
	translations["MOVING"] = "fahrend";
	translations["WAITING"] = "wartend";
	translations["ANCHORAGE"] = "vor Anker";

	// types
	translations["cargo\_ships"] = "Frachter";
	translations["tankships"] = "Tanker";
	translations["coast\_guard\_ships"] = "K&uuml;stenwache";
	translations["passenger\_ships"] = "Passagierschiff";
	translations["sailing\_vessels"] = "Segelschiff";
	translations["pilot\_vessels"] = "Lotsenschiff";
	translations["tugboats"] = "Schlepper";
	translations["anti-pollution\_vessels"] = "Schadstoffbek&auml;mpfung";

	return translations[ais_description];
}


var getMarkerImage = function(type) {
	var result = 'img/';

	switch(type) {
		case 'cargo\_ships':
			result += 'cargoship.png';
			break;
		case 'tankships':
			result += 'tankship.png';
			break;
		case 'coast\_guard\_ships':
			result += 'coastguardship';
		case 'passenger\_ships':
			result += 'passengership.png';
			break;
		case 'sailing\_vessels':
			result += 'sailingship.png';
		default:
			result += 'othership.png';
	}

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
	content = 
       	"<div class='container'>"+
       	"<div class='flag'>"+
		"<img src='http://images.vesseltracker.com/images/flags/"+ vesselinfo.flagid +".png'/> "+
		"</div>" +      	
       	" <div class='vesselname'>"+ cnvrt2Upper(vesselinfo.name)+ "</div>" + translate(vesselinfo.type) +       	
       	"<dl class='table-display'>"+
       	"<img  id='zentriert' border='0' src='http://images.vesseltracker.com/images/vessels/thumbnails/" + vesselinfo.pic +".jpg'/>"+
    	"<dt>L&auml;nge x Breite</dt>"+
    	"<dd>"+ Math.round(vesselinfo.length) + "m x " + Math.round(vesselinfo.width)+"m</dd>"+
    	"<dt>Status</dt>"+
    	"<dd>"+translate(vesselinfo.status)+"</dd>"+
    	"<dt>Geschwindigkeit</dt>"+
    	"<dd>"+vesselinfo.speed+"kn</dd>"+
    	"<dt>Kurs / Richtung</dt>"+
    	"<dd>"+vesselinfo.course+"&deg; / "+ direction[vesselinfo.icon]+"</dd>"+
    	"<dt>Tiefgang</dt>"+
    	"<dd>[TODO]</dd>"+
    	"<dt>Zielhafen</dt>"+
    	"<dd>TODO</dd>"+
    	"</dl>"+
    	"</div>"

	console.log(content);
	return content;
};
