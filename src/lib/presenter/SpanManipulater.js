module.exports = function(spanConfig, model) {
    var spanAdjuster = require('./SpanAdjuster'),
        selectPosition = require('./selectPosition'),
        createSpan = function() {
            var toSpanPosition = function(selection) {
                var positions = selectPosition.toPositions(model.annotationData, selection);
                return {
                    begin: spanAdjuster.adjustSpanBeginLong(spanConfig, model.annotationData.sourceDoc, positions.anchorPosition),
                    end: spanAdjuster.adjustSpanEndLong(spanConfig, model.annotationData.sourceDoc, positions.focusPosition)
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
                        begin: spanAdjuster.adjustSpanBeginLong(spanConfig, model.annotationData.sourceDoc, focusPosition),
                        end: span.end
                    };
                } else {
                    // expand to the right
                    return {
                        begin: span.begin,
                        end: spanAdjuster.adjustSpanEndLong(spanConfig, model.annotationData.sourceDoc, focusPosition)
                    };
                }
            };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var anchorNodeRange = document.createRange();
                anchorNodeRange.selectNode(selection.anchorNode);
                var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

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
                        end: spanAdjuster.adjustSpanEndShort(spanConfig, model.annotationData.sourceDoc, focusPosition)
                    };
                } else {
                    // shorten the left boundary
                    return {
                        begin: spanAdjuster.adjustSpanBeginShort(spanConfig, model.annotationData.sourceDoc, focusPosition),
                        end: span.end
                    };
                }
            };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var focusNodeRange = document.createRange();
                focusNodeRange.selectNode(selection.focusNode);
                var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

                return getNewSpan(spanId, selectionRange, focusNodeRange, focusPosition);
            };
        }();

    return {
        create: createSpan,
        expand: expandSpan,
        shrink: shortenSpan
    };
};