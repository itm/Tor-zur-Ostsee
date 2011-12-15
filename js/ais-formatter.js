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

	var translation = ais_description;

	for(aisName in translations) {
		translation = translation.replace(aisName, translations[aisName]);
	}
	return translation;
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
       	"<img  id='zentriert' border='0' src='http://images.vesseltracker.com/images/vessels/thumbnails/" + vesselinfo.pic +".jpg'/>"+
       	"<dl class='table-display'>"+
    	"<dt>Name</dt>"+
    	"<dd>"+cnvrt2Upper(vesselinfo.name)+"</dd>"+
    	"<dt>Schiffstyp</dt>"+
    	"<dd>"+translate(vesselinfo.type)+"</dd>"+
    	"<dt>Flagge</dt>"+
    	"<dd>"+ "<img src='http://images.vesseltracker.com/images/flags/"+ vesselinfo.flagid +".png'/> " + vesselinfo.nationality+"</dd>"+
    	"<dt>L&auml;nge x Breite</dt>"+
    	"<dd>"+ Math.round(vesselinfo.length) + "m x " + Math.round(vesselinfo.width)+"m</dd>"+
    	"<dt>Status</dt>"+
    	"<dd>"+translate(vesselinfo.status)+"</dd>"+
    	"<dt>Geschwindigkeit</dt>"+
    	"<dd>"+vesselinfo.speed+"kn</dd>"+
    	"<dt>Kurs / Richtung</dt>"+
    	"<dd>"+vesselinfo.course+"&deg; / "+ direction[vesselinfo.icon]+"</dd>"+
    	"</dl>"+
    	"</div>"

	console.log(content);
	return content;
};
