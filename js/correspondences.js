
/**
* Translates a ship's status
* @param {String} status    The status to translate
* @return {String}   Returns a string value containing the translation
*/
tranlateStatus = function(status) {
	switch (status) {
		case "WAITING":
			return "Wartend";
		case "MOORED":
			return "Festgemacht";
		case "MOVING":
			return "Unterwegs";
		case "ANCHORAGE":
			return "Vor Anker / im Hafen";
		default:
			return "Unbekannt";
	}
}

/**
* Translates a ship's type
* @param {String} status    The ship-type to translate
* @return {String}   Returns a string value containing the translation
*/
tranlateType = function(type) {
	switch (type) {
		case "passenger_ship":
			return "Passagierschiff";
		default:
			return "Nicht implementiert";
	}
}
