module.exports = function(model, spanAdjuster) {
    var selectPosition = require('./selectPosition'),
        createSpan = function() {
            var toSpanPosition = function(selection, spanConfig) {
                var positions = selectPosition.toPositions(model.annotationData, selection);
                return {
                    begin: spanAdjuster.backFromBegin(model.annotationData.sourceDoc, positions.anchorPosition, spanConfig),
                    end: spanAdjuster.forwardFromEnd(model.annotationData.sourceDoc, positions.focusPosition - 1, spanConfig) + 1
                };
            };

            return function(selection, spanConfig) {
                model.selectionModel.clear();
                return toSpanPosition(selection, spanConfig);
            };
        }(),
        expandSpan = function() {
            var getNewSpan = function(spanId, selectionRange, anchorNodeRange, focusPosition, spanConfig) {
                var span = model.annotationData.span.get(spanId);

                if (selectionRange.compareBoundaryPoints(Range.START_TO_START, anchorNodeRange) < 0) {
                    // expand to the left
                    return {
                        begin: spanAdjuster.backFromBegin(model.annotationData.sourceDoc, focusPosition, spanConfig),
                        end: span.end
                    };
                } else {
                    // expand to the right
                    return {
                        begin: span.begin,
                        end: spanAdjuster.forwardFromEnd(model.annotationData.sourceDoc, focusPosition - 1, spanConfig) + 1
                    };
                }
            };

            return function(spanId, selection, spanConfig) {
                model.selectionModel.clear();

                var anchorNodeRange = document.createRange();
                anchorNodeRange.selectNode(selection.anchorNode);
                var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

                return getNewSpan(spanId, selection.range, anchorNodeRange, focusPosition, spanConfig);
            };
        }(),
        shortenSpan = function() {
            var getNewSpan = function(spanId, selectionRange, focusNodeRange, focusPosition, spanConfig) {
                var span = model.annotationData.span.get(spanId);
                if (selectionRange.compareBoundaryPoints(Range.START_TO_START, focusNodeRange) > 0) {
                    // shorten the right boundary
                    if (span.begin === focusPosition) return {
                        begin: span.begin,
                        end: span.begin
                    };

                    return {
                        begin: span.begin,
                        end: spanAdjuster.backFromEnd(model.annotationData.sourceDoc, focusPosition - 1, spanConfig) + 1
                    };
                } else {
                    // shorten the left boundary
                    if (span.end === focusPosition) return {
                        begin: span.end,
                        end: span.end
                    };

                    return {
                        begin: spanAdjuster.forwardFromBegin(model.annotationData.sourceDoc, focusPosition, spanConfig),
                        end: span.end
                    };
                }
            };

            return function(spanId, selection, spanConfig) {
                model.selectionModel.clear();

                var focusNodeRange = document.createRange();
                focusNodeRange.selectNode(selection.focusNode);
                var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

                return getNewSpan(spanId, selection.range, focusNodeRange, focusPosition, spanConfig);
            };
        }();

    return {
        create: createSpan,
        expand: expandSpan,
        shrink: shortenSpan
    };
};
