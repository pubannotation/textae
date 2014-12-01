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
    backFromBegin = function(str, beginPosition, spanConfig) {
        var nonEdgePos = skipForwardBlank(str, beginPosition, spanConfig.isBlankCharacter),
            nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

        return nonDelimPos;
    },
    forwardFromEnd = function(str, endPosition, spanConfig) {
        var nonEdgePos = skipBackBlank(str, endPosition, spanConfig.isBlankCharacter),
            nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

        return nonDelimPos;
    },
    // adjust the beginning position of a span for shortening
    forwardFromBegin = function(str, beginPosition, spanConfig) {
        var isWordEdge = _.partial(isWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
        return skipToWord(str, beginPosition, isWordEdge);
    },
    // adjust the end position of a span for shortening
    backFromEnd = function(str, endPosition, spanConfig) {
        var isWordEdge = _.partial(isWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
        return backToWord(str, endPosition, isWordEdge);
    },
    delimiterDetector = {
        backFromBegin: backFromBegin,
        forwardFromEnd: forwardFromEnd,
        forwardFromBegin: forwardFromBegin,
        backFromEnd: backFromEnd,
        blankSkipper: {
            backFromBegin: function(str, position, spanConfig) {
                return skipForwardBlank(str, position, spanConfig.isBlankCharacter);
            },
            forwardFromEnd: function(str, position, spanConfig) {
                return skipBackBlank(str, position, spanConfig.isBlankCharacter);
            },
            forwardFromBegin: function(str, position, spanConfig) {
                return skipForwardBlank(str, position, spanConfig.isBlankCharacter);
            },
            backFromEnd: function(str, position, spanConfig) {
                return skipBackBlank(str, position, spanConfig.isBlankCharacter);
            }
        }
    };

module.exports = delimiterDetector;