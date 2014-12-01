module.exports = function(model) {
    var delimiterDetector = require('./delimiterDetector'),
        selectPosition = require('./selectPosition'),
        createSpan = function() {
            var toSpanPosition = function(selection, spanConfig) {
                var positions = selectPosition.toPositions(model.annotationData, selection);
                return {
                    begin: delimiterDetector.backFromBegin(spanConfig, model.annotationData.sourceDoc, positions.anchorPosition),
                    end: delimiterDetector.forwardFromEnd(spanConfig, model.annotationData.sourceDoc, positions.focusPosition)
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
                        begin: delimiterDetector.backFromBegin(spanConfig, model.annotationData.sourceDoc, focusPosition),
                        end: span.end
                    };
                } else {
                    // expand to the right
                    return {
                        begin: span.begin,
                        end: delimiterDetector.forwardFromEnd(spanConfig, model.annotationData.sourceDoc, focusPosition)
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
                    return {
                        begin: span.begin,
                        end: delimiterDetector.backFromEnd(spanConfig, model.annotationData.sourceDoc, focusPosition)
                    };
                } else {
                    // shorten the left boundary
                    return {
                        begin: delimiterDetector.forwardFromBegin(spanConfig, model.annotationData.sourceDoc, focusPosition),
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