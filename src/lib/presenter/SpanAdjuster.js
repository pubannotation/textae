// adjust the beginning position of a span
var getChar = function(sourceDoc, offset, pos) {
        return sourceDoc.charAt(pos + offset);
    },
    skipCharacters = function(predicate, startPositios, step) {
        while (predicate(startPositios)) {
            startPositios += step;
        }
        return startPositios;
    },
    bind = function(obj, functionName) {
        return obj[functionName].bind(obj);
    },
    IsCharNonEdgeChar = function(spanConfig, sourceDoc, offset) {
        var getOffsetChar = _.partial(getChar, sourceDoc, offset);

        return function(position) {
            return spanConfig.isBlankCharacter(getOffsetChar(position));
        };
    },
    adjustSpanBeginLong = function(spanConfig, sourceDoc, beginPosition) {
        var isPosCharNonEdgeChar = new IsCharNonEdgeChar(spanConfig, sourceDoc, 0),
            isPosPreNonDelimChar = function(pos) {
                return !spanConfig.isDelimiter(getChar(sourceDoc, 0, pos)) &&
                    !spanConfig.isDelimiter(getChar(sourceDoc, -1, pos));
            },
            nonEdgePos = skipCharacters(isPosCharNonEdgeChar, beginPosition, 1),
            nonDelimPos = skipCharacters(isPosPreNonDelimChar, nonEdgePos, -1);

        return nonDelimPos;
    },
    // adjust the end position of a span
    adjustSpanEndLong = function(spanConfig, sourceDoc, endPosition) {
        var isBlankCharacter = bind(spanConfig, 'isBlankCharacter'),
            isPreCharNonEdgeChar = new IsCharNonEdgeChar(spanConfig, sourceDoc, -1),
            isPosCharNonDelimiChar = function(pos) {
                // Return false to stop an infinite loop when the character undefined.
                return sourceDoc.charAt(pos) &&
                    !spanConfig.isDelimiter(sourceDoc.charAt(pos));
            },
            nonEdgePos = skipCharacters(isPreCharNonEdgeChar, endPosition, -1),
            nonDelimPos = skipCharacters(isPosCharNonDelimiChar, nonEdgePos, 1);

        return nonDelimPos;
    },
    // adjust the beginning position of a span for shortening
    adjustSpanBeginShort = function(spanConfig, sourceDoc, beginPosition) {
        var pos = beginPosition;

        // Proceed the position between two characters as (nonEdge || delimiter)(!delimiter). 
        while (!spanConfig.isBlankCharacter(sourceDoc.charAt(pos - 1)) &&
            !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1)) ||
            spanConfig.isDelimiter(sourceDoc.charAt(pos))
        ) {
            pos++;
        }
        return pos;
    },
    // adjust the end position of a span for shortening
    adjustSpanEndShort = function(spanConfig, sourceDoc, endPosition) {
        var pos = endPosition;

        // Proceed the position between two characters as (nonEdge || delimiter)(!delimiter). 
        while (!spanConfig.isBlankCharacter(sourceDoc.charAt(pos)) &&
            !spanConfig.isDelimiter(sourceDoc.charAt(pos)) ||
            spanConfig.isDelimiter(sourceDoc.charAt(pos - 1))
        ) {
            pos--;
        }
        return pos;
    },
    spanAdjuster = {
        adjustSpanBeginLong: adjustSpanBeginLong,
        adjustSpanEndLong: adjustSpanEndLong,
        adjustSpanBeginShort: adjustSpanBeginShort,
        adjustSpanEndShort: adjustSpanEndShort
    };

module.exports = spanAdjuster;