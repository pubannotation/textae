// Get spans their stirng is same with the originSpan from sourceDoc.
var getSpansTheirStringIsSameWith = function(sourceDoc, originSpan) {
		var getNextStringIndex = String.prototype.indexOf.bind(
				sourceDoc,
				sourceDoc.substring(originSpan.begin, originSpan.end)
			),
			length = originSpan.end - originSpan.begin,
			findStrings = [],
			offset = 0;

		for (var index = getNextStringIndex(offset); index !== -1; index = getNextStringIndex(offset)) {
			findStrings.push({
				begin: index,
				end: index + length
			});

			offset = index + length;
		}

		return findStrings;
	},
	// The preceding charactor and the following of a word charactor are delimiter.
	// For example, 't' ,a part of 'that', is not same with an origin span when it is 't'. 
	isWord = function(sourceDoc, spanConfig, candidateSpan) {
		var precedingChar = sourceDoc.charAt(candidateSpan.begin - 1);
		var followingChar = sourceDoc.charAt(candidateSpan.end);

		return spanConfig.isDelimiter(precedingChar) && spanConfig.isDelimiter(followingChar);
	},
	// Is the candidateSpan is spaned already?
	isAlreadySpaned = function(allSpans, candidateSpan) {
		return allSpans.filter(function(existSpan) {
			return existSpan.begin === candidateSpan.begin &&
				existSpan.end === candidateSpan.end;
		}).length > 0;
	},
	not = function(val) {
		return !val;
	},
	isBoundaryCrossingWithOtherSpans = require('./isBoundaryCrossingWithOtherSpans');

module.exports = function(dataStore, originSpan, spanConfig) {
	var allSpans = dataStore.span.all();

	return getSpansTheirStringIsSameWith(dataStore.sourceDoc, originSpan)
		.filter(function(span) {
			// The candidateSpan is a same span when begin is same.
			// Because string of each others are same. End of them are same too.
			return span.begin !== originSpan.begin;
		})
		.filter(_.partial(isWord, dataStore.sourceDoc, spanConfig))
		.filter(
			_.compose(
				not,
				_.partial(isAlreadySpaned, allSpans)
			)
		)
		.filter(
			_.compose(
				not,
				_.partial(isBoundaryCrossingWithOtherSpans, allSpans)
			)
		);
};