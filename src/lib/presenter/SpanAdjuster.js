// adjust the beginning position of a span
var skipCharacters = function(toChars, step, str, position, predicate) {
        while (predicate(toChars(str, position)))
            position += step;

        return position;
    },
    getNow = function(str, position) {
        return str.charAt(position);
    },
    getPrev = function(str, position) {
        return [str.charAt(position), str.charAt(position - 1)];
    },
    getNext = function(str, position) {
        return [str.charAt(position), str.charAt(position + 1)];
    },
    skipForwadBlank = function(str, position, isBlankCharacter) {
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
    },
    backToDelimiter = function(str, position, isDelimiter) {
        return skipCharacters(
            getPrev, -1,
            str,
            position,
            function(chars) {
                // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).       
                return !isDelimiter(chars[0]) &&
                    !isDelimiter(chars[1]);
            }
        );
    },
    skipToDelimiter = function(str, position, isDelimiter) {
        return skipCharacters(
            getNext, 1,
            str,
            position,
            function(chars) {
                // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).       
                // Return false to stop an infinite loop when the character undefined.
                return str.charAt(chars[1]) &&
                    !isDelimiter(chars[0]) &&
                    !isDelimiter(chars[1]);
            }
        );
    },
    // Proceed the position between two characters as (blank || delimiter)(!delimiter). 
    isWord = function(isBlankCharacter, isDelimiter, chars) {
        return !isBlankCharacter(chars[1]) &&
            !isDelimiter(chars[1]) ||
            isDelimiter(chars[0]);
    },
    skipToWord = function(str, position, isWordEdge) {
        return skipCharacters(
            getPrev, 1,
            str,
            position,
            isWordEdge
        );
    },
    backToWord = function(str, position, isWordEdge) {
        return skipCharacters(
            getNext, -1,
            str,
            position,
            isWordEdge
        );
    },
    backFromBegin = function(spanConfig, str, beginPosition) {
        var nonEdgePos = skipForwadBlank(str, beginPosition, spanConfig.isBlankCharacter),
            nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

        return nonDelimPos;
    },
    forwardFromEnd = function(spanConfig, str, nextPosition) {
        var endPosition = nextPosition - 1,
            nonEdgePos = skipBackBlank(str, endPosition, spanConfig.isBlankCharacter),
            nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

        return nonDelimPos + 1;
    },
    // adjust the beginning position of a span for shortening
    forwardFromBegin = function(spanConfig, str, beginPosition) {
        var isWordEdge = _.partial(isWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
        return skipToWord(str, beginPosition, isWordEdge);
    },
    // adjust the end position of a span for shortening
    backFromEnd = function(spanConfig, str, nextPosition) {
        var isWordEdge = _.partial(isWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
        return backToWord(str, nextPosition - 1, isWordEdge) + 1;
    },
    delimiterDetector = {
        backFromBegin: backFromBegin,
        forwardFromEnd: forwardFromEnd,
        forwardFromBegin: forwardFromBegin,
        backFromEnd: backFromEnd
    };

module.exports = delimiterDetector;