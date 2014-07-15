module.exports = function(spanConfig, annotationData) {
    var getPosition = function(node) {
        var $parent = $(node).parent();
        var parentId = $parent.attr("id");

        var pos;
        if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
            pos = annotationData.paragraph.get(parentId).begin;
        } else if ($parent.hasClass("textae-editor__span")) {
            pos = annotationData.span.get(parentId).begin;
        } else {
            throw new Error('Can not get position of a node : ' + node);
        }

        var childNodes = node.parentElement.childNodes;
        for (var i = 0; childNodes[i] != node; i++) { // until the focus node
            pos += (childNodes[i].nodeName == "#text") ? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
        }

        return pos;
    };

    var getFocusPosition = function(selection) {
        var pos = getPosition(selection.focusNode);
        return pos += selection.focusOffset;
    };

    var getAnchorPosition = function(selection) {
        var pos = getPosition(selection.anchorNode);
        return pos + selection.anchorOffset;
    };

    // adjust the beginning position of a span
    var adjustSpanBeginLong = function(beginPosition) {
        var pos = beginPosition;

        while (
            spanConfig.isNonEdgeCharacter(annotationData.sourceDoc.charAt(pos))
        ) {
            pos++;
        }

        while (
            pos > 0 &&
            !spanConfig.isDelimiter(annotationData.sourceDoc.charAt(pos)) &&
            !spanConfig.isDelimiter(annotationData.sourceDoc.charAt(pos - 1))
        ) {
            pos--;
        }
        return pos;
    };

    // adjust the end position of a span
    var adjustSpanEndLong = function(endPosition) {
        var pos = endPosition;

        while (
            spanConfig.isNonEdgeCharacter(annotationData.sourceDoc.charAt(pos - 1))
        ) {
            pos--;
        }

        while (!spanConfig.isDelimiter(annotationData.sourceDoc.charAt(pos)) &&
            pos < annotationData.sourceDoc.length
        ) {
            pos++;
        }
        return pos;
    };

    // adjust the beginning position of a span for shortening
    var adjustSpanBeginShort = function(beginPosition) {
        var pos = beginPosition;
        while (
            pos < annotationData.sourceDoc.length &&
            (
                spanConfig.isNonEdgeCharacter(annotationData.sourceDoc.charAt(pos)) ||
                !spanConfig.isDelimiter(annotationData.sourceDoc.charAt(pos - 1))
            )
        ) {
            pos++;
        }
        return pos;
    };

    // adjust the end position of a span for shortening
    var adjustSpanEndShort = function(endPosition) {
        var pos = endPosition;
        while (
            pos > 0 &&
            (
                spanConfig.isNonEdgeCharacter(annotationData.sourceDoc.charAt(pos - 1)) ||
                !spanConfig.isDelimiter(annotationData.sourceDoc.charAt(pos))
            )
        ) {
            pos--;
        }
        return pos;
    };

    var toPositions = function(selection) {
        var anchorPosition = getAnchorPosition(selection);
        var focusPosition = getFocusPosition(selection);

        // switch the position when the selection is made from right to left
        if (anchorPosition > focusPosition) {
            var tmpPos = anchorPosition;
            anchorPosition = focusPosition;
            focusPosition = tmpPos;
        }

        return {
            anchorPosition: anchorPosition,
            focusPosition: focusPosition
        };
    };

    return {
        toPositions: toPositions,
        getAnchorPosition: getAnchorPosition,
        getFocusPosition: getFocusPosition,
        adjustSpanBeginLong: adjustSpanBeginLong,
        adjustSpanEndLong: adjustSpanEndLong,
        adjustSpanBeginShort: adjustSpanBeginShort,
        adjustSpanEndShort: adjustSpanEndShort
    };
};