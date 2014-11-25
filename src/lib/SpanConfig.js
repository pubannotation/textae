module.exports = function() {
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
		},
		api = {
			delimiterCharacters: null,
			nonEdgeCharacters: null,
			reset: function() {
				this.set(defaults);
			},
			set: function(config) {
				var settings = _.extend({}, defaults, config);

				if (settings['delimiter characters'] !== undefined) {
					api.delimiterCharacters = settings['delimiter characters'];
				}

				if (settings['non-edge characters'] !== undefined) {
					api.nonEdgeCharacters = settings['non-edge characters'];
				}

				return config;
			},
			isNonEdgeCharacter: function(char) {
				return (api.nonEdgeCharacters.indexOf(char) >= 0);
			},
			isDelimiter: function(char) {
				if (api.delimiterCharacters.indexOf('ANY') >= 0) {
					return 1;
				}
				return (api.delimiterCharacters.indexOf(char) >= 0);
			}
		};

	return api;
};