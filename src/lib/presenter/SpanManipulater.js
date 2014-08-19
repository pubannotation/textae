module.exports = function(spanConfig, model) {
    var spanAdjuster = require('./SpanAdjuster')(spanConfig, model.annotationData),
        createSpan = function() {
            var toSpanPosition = function(selection) {
                var positions = spanAdjuster.toPositions(selection);
                return {
                    begin: spanAdjuster.adjustSpanBeginLong(positions.anchorPosition),
                    end: spanAdjuster.adjustSpanEndLong(positions.focusPosition)
                };
            };

            return function(selection) {
                model.selectionModel.clear();
                return toSpanPosition(selection);
            };
        }(),
        expandSpan = function() {
            var getNewSpan = function(spanId, selectionRange, anchorNodeRange, focusPosition) {
                var span = model.annotationData.span.get(spanId);

                if (selectionRange.compareBoundaryPoints(Range.START_TO_START, anchorNodeRange) < 0) {
                    // expand to the left
                    return {
                        begin: spanAdjuster.adjustSpanBeginLong(focusPosition),
                        end: span.end
                    };
                } else {
                    // expand to the right
                    return {
                        begin: span.begin,
                        end: spanAdjuster.adjustSpanEndLong(focusPosition)
                    };
                }
            };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var anchorNodeRange = document.createRange();
                anchorNodeRange.selectNode(selection.anchorNode);
                var focusPosition = spanAdjuster.getFocusPosition(selection);

                return getNewSpan(spanId, selectionRange, anchorNodeRange, focusPosition);
            };
        }(),
        shortenSpan = function() {
            var getNewSpan = function(spanId, selectionRange, focusNodeRange, focusPosition) {
                var span = model.annotationData.span.get(spanId);
                if (selectionRange.compareBoundaryPoints(Range.START_TO_START, focusNodeRange) > 0) {
                    // shorten the right boundary
                    return {
                        begin: span.begin,
                        end: spanAdjuster.adjustSpanEndShort(focusPosition)
                    };
                } else {
                    // shorten the left boundary
                    return {
                        begin: spanAdjuster.adjustSpanBeginShort(focusPosition),
                        end: span.end
                    };
                }
            };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var focusNodeRange = document.createRange();
                focusNodeRange.selectNode(selection.focusNode);
                var focusPosition = spanAdjuster.getFocusPosition(selection);

                return getNewSpan(spanId, selectionRange, focusNodeRange, focusPosition);
            };
        }();

    return {
        create: createSpan,
        expand: expandSpan,
        shrink: shortenSpan
    };
};