var skipCharacters = require('./skipCharacters'),
	getNow = function(str, position) {
		return str.charAt(position);
	},
	skipForwardBlank = function(str, position, isBlankCharacter) {
		return skipCharacters(
			getNow, 1,
			str,
			position,
			isBlankCharacter
		);
	},
	skipBackBlank = function(str, position, isBlankCharacter) {
		return skipCharacters(
			getNow, -1,
			str,
			position,
			isBlankCharacter
		);
	};

module.exports = {
	forward: skipForwardBlank,
	back: skipBackBlank
};