// constant values
var CONSTS = {
    BLOCK_THRESHOLD: 100
};

module.exports = function(editor, spanConfig, model, command, viewModel) {
    var idFactory = require('../util/IdFactory')(editor),
        dismissBrowserSelection = require('./dismissBrowserSelection'),
        spanAdjuster = require('./SpanAdjuster')(spanConfig, model.annotationData),
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

                var newSpan = toSpanPosition(selection);

                // The span cross exists spans.
                if (model.annotationData.isBoundaryCrossingWithOtherSpans({
                    begin: newSpan.begin,
                    end: newSpan.end
                })) {
                    dismissBrowserSelection();
                    return;
                }

                // The span exists already.
                var spanId = idFactory.makeSpanId(newSpan.begin, newSpan.end);
                if (model.annotationData.span.get(spanId)) {
                    dismissBrowserSelection();
                    return;
                }

                var commands = [command.factory.spanCreateCommand(
                    viewModel.typeContainer.entity.getDefaultType(), {
                        begin: newSpan.begin,
                        end: newSpan.end
                    }
                )];

                if (viewModel.modeAccordingToButton['replicate-auto'].value() && newSpan.end - newSpan.begin <= CONSTS.BLOCK_THRESHOLD) {
                    commands.push(command.factory.spanReplicateCommand(
                        viewModel.typeContainer.entity.getDefaultType(), {
                            begin: newSpan.begin,
                            end: newSpan.end
                        }));
                }

                command.invoke(commands);
                dismissBrowserSelection();
            };
        }(),
        moveSpan = function(spanId, begin, end) {
            // Do not need move.
            if (spanId === idFactory.makeSpanId(begin, end)) {
                return;
            }

            return [command.factory.spanMoveCommand(spanId, begin, end)];
        },
        expandSpan = function() {
            var getNewSpan = function(spanId, selectionRange, anchorNodeRange, focusPosition) {
                var span = model.annotationData.span.get(spanId);

                if (selectionRange.compareBoundaryPoints(Range.START_TO_START, anchorNodeRange) < 0) {
                    // expand to the left
                    return {
                        begin: spanAdjuster.adjustSpanBeginLong(focusPosition),
                        end: span.end
                    }
                } else {
                    // expand to the right
                    return {
                        begin: span.begin,
                        end: spanAdjuster.adjustSpanEndLong(focusPosition)
                    }
                }
            };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var anchorNodeRange = document.createRange();
                anchorNodeRange.selectNode(selection.anchorNode);
                var focusPosition = spanAdjuster.getFocusPosition(selection);

                var newSpan = getNewSpan(spanId, selectionRange, anchorNodeRange, focusPosition)
                var commands = moveSpan(spanId, newSpan.begin, newSpan.end);

                command.invoke(commands);
                dismissBrowserSelection();
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
                },
                removeSpan = function(spanId) {
                    return [command.factory.spanRemoveCommand(spanId)];
                };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var focusNodeRange = document.createRange();
                focusNodeRange.selectNode(selection.focusNode);
                var focusPosition = spanAdjuster.getFocusPosition(selection);

                var newSpan = getNewSpan(spanId, selectionRange, focusNodeRange, focusPosition),
                    newSpanId = idFactory.makeSpanId(newSpan.begin, newSpan.end),
                    sameSpan = model.annotationData.span.get(newSpanId);

                var commands = newSpan.begin < newSpan.end && !sameSpan ?
                    moveSpan(spanId, newSpan.begin, newSpan.end) :
                    commands = removeSpan(spanId);

                command.invoke(commands);
                dismissBrowserSelection();
            };
        }();

    return {
        create: createSpan,
        expand: expandSpan,
        shrink: shortenSpan
    };
};