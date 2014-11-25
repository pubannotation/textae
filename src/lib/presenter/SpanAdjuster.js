// adjust the beginning position of a span
var adjustSpanBeginLong = function(spanConfig, sourceDoc, beginPosition) {
        var pos = beginPosition;

        while (
            spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos))
        ) {
            pos++;
        }

        while (
            pos > 0 &&
            !spanConfig.isDelimiter(sourceDoc.charAt(pos)) &&
            !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1))
        ) {
            pos--;
        }
        return pos;
    },
    // adjust the end position of a span
    adjustSpanEndLong = function(spanConfig, sourceDoc, endPosition) {
        var pos = endPosition;

        while (
            spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos - 1))
        ) {
            pos--;
        }

        while (!spanConfig.isDelimiter(sourceDoc.charAt(pos)) &&
            pos < sourceDoc.length
        ) {
            pos++;
        }
        return pos;
    },
    // adjust the beginning position of a span for shortening
    adjustSpanBeginShort = function(spanConfig, sourceDoc, beginPosition) {
        var pos = beginPosition;
        while (
            pos < sourceDoc.length &&
            (
                spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos)) ||
                !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1))
            )
        ) {
            pos++;
        }
        return pos;
    },
    // adjust the end position of a span for shortening
    adjustSpanEndShort = function(spanConfig, sourceDoc, endPosition) {
        var pos = endPosition;
        while (
            pos > 0 &&
            (
                spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos - 1)) ||
                !spanConfig.isDelimiter(sourceDoc.charAt(pos))
            )
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