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


var translate = function(ais_description) {
	var translation = translations[ais_description];
    if ( translation === undefined ){
		translation = ais_description;
	}
	return translation;
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

var getDirection = function(cog) {
  if ( cog > 45-22.5 && cog < 45+22.5)
    return "Nordost";
  else if  ( cog > 90-22.5 && cog < 90+22.5)
    return "Ost";
  else if  ( cog > 135-22.5 && cog < 135+22.5)
    return "S&uuml;dost";
  else if  ( cog > 180-22.5 && cog < 180+22.5)
    return "S&uuml;d";
  else if  ( cog > 225-22.5 && cog < 225+22.5)
    return "S&uuml;dwest";
  else if  ( cog > 270-22.5 && cog < 270+22.5)
    return "West";
  else if  ( cog > 315-22.5 && cog < 315+22.5)
    return "Nordwest";
  else
    return "Nord";
}

var createMarkerContent = function(vesselinfo) {
	// get optional content
	var description = new Object();
	var imagePos = "centered"

	imagePos = "centered_minInfo";
   	description.pic = (vesselinfo.pic != null)?"<a href='" + picHref + vesselinfo.pic + ".html'>"+
									"<img  id='"+imagePos+"' border='0' src='" + picSrc + vesselinfo.pic + ".jpg' alt=''/>"+
        						"</a>":"";

	description.draught = ((vesselinfo.draught != null) && (vesselinfo.draught != "null")) ? vesselinfo.draught.replace(".", ",")+" m" : noInfoText;

	description.pod = (vesselinfo.destination != null) ? $.trim(cnvrt2Upper(vesselinfo.destination)) : noInfoText;

	if (description.pod.length == 0 || description.pod == "Ziel"){
		description.pod = noInfoText;
	}

	content = 
       "<div class='container'>"+
       	" <span class='vesselname'>"+ cnvrt2Upper(vesselinfo.name) + "<span class=\"vessel-type\">" + translate(vesselinfo.type) + "</span></span>" +    	
			"<dl class='table-display'>"+
			    "<dt>L&auml;nge x Breite</dt>"+
			    "<dd>"+ Math.round(vesselinfo.length) + "m x " + Math.round(vesselinfo.width)+"m</dd>"+
			    "<dt>Status</dt>"+
			    "<dd>"+translate(vesselinfo.status)+"</dd>"+
			    "<dt>Geschwindigkeit</dt>"+
			    "<dd>"+vesselinfo.speed+"kn</dd>"+
			    "<dt>Kurs / Richtung</dt>"+
			    "<dd>"+vesselinfo.course+"&deg; / "+ getDirection(vesselinfo.course)+"</dd>"+
			    "<dt>Tiefgang</dt>"+
			    "<dd>"+description.draught+"</dd>"+
			    "<dt>Ziel</dt>"+
			    "<dd>"+description.pod+"</dd>"+
		    "</dl>"+
		    "<div class=\"origin\">AIS Daten von www.ThomasKnauf.de</div>" +
    	"</div>";

	//console.log(content);
	return content;
};
