// adjust the beginning position of a span
var skipCharacters = function(position, predicate, step) {
        while (predicate(position)) {
            position += step;
        }
        return position;
    },
    IsOffsetChar = function(str, offset, predicate) {
        return function(position) {
            var c = str.charAt(position + offset);
            return predicate(c);
        };
    },
    IsPosPreNonDelimChar = function(spanConfig, sourceDoc) {
        return function(pos) {
            return !spanConfig.isDelimiter(sourceDoc.charAt(pos)) &&
                !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1));
        };
    },
    skipForwadBlank = function(spanConfig, sourceDoc, beginPosition) {
        var isPosCharBlankChar = new IsOffsetChar(sourceDoc, 0, spanConfig.isBlankCharacter);

        return skipCharacters(beginPosition, isPosCharBlankChar, 1);
    },
    skipBackBlank = function(spanConfig, sourceDoc, endPosition) {
        var isPreCharBlankChar = new IsOffsetChar(sourceDoc, -1, spanConfig.isBlankCharacter);

        return skipCharacters(endPosition, isPreCharBlankChar, -1);
    },
    adjustSpanBeginLong = function(spanConfig, sourceDoc, beginPosition) {
        var isPosPreNonDelimChar = new IsPosPreNonDelimChar(spanConfig, sourceDoc),
            nonEdgePos = skipForwadBlank(spanConfig, sourceDoc, beginPosition),
            nonDelimPos = skipCharacters(nonEdgePos, isPosPreNonDelimChar, -1);

        return nonDelimPos;
    },
    // adjust the end position of a span
    adjustSpanEndLong = function(spanConfig, sourceDoc, endPosition) {
        var isPosCharNonDelimiChar = function(pos) {
                // Return false to stop an infinite loop when the character undefined.
                return sourceDoc.charAt(pos) &&
                    !spanConfig.isDelimiter(sourceDoc.charAt(pos));
            },
            nonEdgePos = skipBackBlank(spanConfig, sourceDoc, endPosition),
            nonDelimPos = skipCharacters(nonEdgePos, isPosCharNonDelimiChar, 1);

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