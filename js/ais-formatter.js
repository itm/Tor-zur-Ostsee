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
