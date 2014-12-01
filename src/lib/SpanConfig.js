var defaults = {
	"delimiter characters": [
		" ",
		".",
		"!",
		"?",
		",",
		":",
		";",
		"-",
		"/",
		"&",
		"(",
		")",
		"{",
		"}",
		"[",
		"]",
		"+",
		"*",
		"\\",
		"\"",
		"'",
		"\n",
		"–"
	],
	"non-edge characters": [
		" ",
		"\n"
	]
};

module.exports = function() {
	var delimiterCharacters = [],
		blankCharacters = [],
		set = function(config) {
			var settings = _.extend({}, defaults, config);

			delimiterCharacters = settings['delimiter characters'];
			blankCharacters = settings['non-edge characters'];
			return config;
		},
		reset = _.partial(set, defaults),
		isDelimiter = function(char) {
			if (delimiterCharacters.indexOf('ANY') >= 0) {
				return 1;
			}
			return delimiterCharacters.indexOf(char) >= 0;
		},
		isBlankCharacter = function(char) {
			return blankCharacters.indexOf(char) >= 0;
		},
		removeBlankChractors = function(str) {
			blankCharacters.forEach(function(char) {
				str = str.replace(char, '');
			});
			return str;
		};

	return {
		reset: reset,
		set: set,
		isDelimiter: isDelimiter,
		isBlankCharacter: isBlankCharacter,
		removeBlankChractors: removeBlankChractors
	};
};