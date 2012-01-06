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

function tFix(wert,ds){
       var wert=(wert.toFixed)?wert.toFixed(ds):
        Math.floor(wert)+"."+
(Math.pow(10,ds)+Math.round((wert-Math.floor(wert))*
           Math.pow(10,ds))+"").substr(1,ds);
return wert;
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
	var imagePos = "centered"

	imagePos = "centered_minInfo";
   	description.pic = (vesselinfo.pic != null)?"<a href='http://www.vesseltracker.com/de/ShipPhotos/" +vesselinfo.pic+".html'>"+
									"<img  id='"+imagePos+"' border='0' src='http://images.vesseltracker.com/images/vessels/small/" + 
									vesselinfo.pic +".jpg' width='240' alt='click image to get larger ship picture'/>"+
        						"</a>":"";
	description.draught = ((vesselinfo.draught != null) && (vesselinfo.draught != "null"))?vesselinfo.draught:"---";
	description.pod = (vesselinfo.pod != null)?vesselinfo.pod:"---";
	
	content = 
       "<div class='container'>"+
       	"<div class='flag'>"+"<img src='http://images.vesseltracker.com/images/flags/"+ vesselinfo.flagid +".png'/> "+"</div>" +      	
       	" <div class='vesselname'>"+ cnvrt2Upper(vesselinfo.name)+ "</div>" + translateType(vesselinfo.type) +         	
"<dl class='table-display'>"+
"<table class='table-display-table' cellspacing='0' cellpadding='0'>"+
	"<tr><td valign='top'>" +
		"<table class='table-display-table' cellspacing='0' cellpadding='0'>" +
    	"<tr><td id='tdfirst'>L&auml;nge x Breite</td>"+ 	"<td id='tdsecond'>"+ Math.round(vesselinfo.length) + "m x " + Math.round(vesselinfo.width)+"m</td></tr>"+
    	"<tr><td id='tdfirst'>Status</td>"+	"<td id='tdsecond'>"+translateStatus(vesselinfo.status)+"</td></tr>"+
    	"<tr><td id='tdfirst'>Geschwindigkeit&nbsp;&nbsp;</td>"+ 	"<td id='tdsecond'>"+vesselinfo.speed.replace(".", ",")+"&nbsp;Knoten</td></tr>"+
    	"<tr><td id='tdfirst'>Kurs / Richtung</td>"+ ((vesselinfo.status=="MOVING")?"<td id='tdsecond'>"+vesselinfo.course+"&deg; / "+ direction[vesselinfo.icon]+"</td></tr>":"<td id='tdsecond'> --- / ---</td></tr>")+
    	"<tr><td id='tdfirst'>Tiefgang</td>"+ 	"<td id='tdsecond'>"+description.draught.replace(".", ",")+" m</td></tr>"+
    	"<tr><td id='tdfirst'>Ziel</td>"+ 	"<td id='tdsecond'>"+cnvrt2Upper(description.pod)+"</td></tr>"+
		"</table>" +
		"</td><td id='table-display-pic' >" +
       	description.pic+   
		"</td></tr></table>" +
		"</dl>" +
    	"</div>";

	//console.log(content);
	return content;
};
