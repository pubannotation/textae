import idFactory from '../../idFactory';
import {
    isBoundaryCrossingWithOtherSpans as isBoundaryCrossingWithOtherSpans
}
from '../../Model/AnnotationData/parseAnnotation/validateAnnotation';
import isAlreadySpaned from '../../Model/isAlreadySpaned';
import deferAlert from './deferAlert';
import delimiterDetectAdjuster from '../spanAdjuster/delimiterDetectAdjuster';
import blankSkipAdjuster from '../spanAdjuster/blankSkipAdjuster';
import SpanManipulater from './SpanManipulater';
import SelectionParser from './SelectionParser';

export default function(editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto) {
    const spanAdjuster = isDetectDelimiterEnable ? delimiterDetectAdjuster : blankSkipAdjuster,
        spanManipulater = new SpanManipulater(model, spanAdjuster),
        selectionParser = new SelectionParser(editor, model),
        doCreate = _.partial(DoCreate, model, command, typeContainer, spanManipulater, isDetectDelimiterEnable, isReplicateAuto),
        doExpandSpanToSelection = _.partial(expandSpanToSelection, editor, model, command, spanManipulater),
        doExpand = _.partial(DoExpand, model, selectionParser, doExpandSpanToSelection),
        doShrinkSpanToSelection = _.partial(shrinkSpanToSelection, editor, model, command, spanManipulater),
        doShrink = _.partial(DoShrink, model, selectionParser, doShrinkSpanToSelection);

    return {
        create: _.partial(processSelectionIf, doCreate, selectionParser.isInOneParent),
        expand: _.partial(processSelectionIf, doExpand, selectionParser.isAnchrNodeInSpan),
        shrink: _.partial(processSelectionIf, doShrink, selectionParser.isFocusNodeInSpan),
    };
}

function processSelectionIf(doFunc, predicate, data) {
    if (data && predicate(data.selection)) {
        return doFunc(data);
    }
    return data;
}

function moveSpan(editor, command, spanId, newSpan) {
    // Do not need move.
    if (spanId === idFactory.makeSpanId(editor, newSpan)) {
        return;
    }

    return [command.factory.spanMoveCommand(spanId, newSpan)];
}

function removeSpan(command, spanId) {
    return [command.factory.spanRemoveCommand(spanId)];
}

function DoCreate(model, command, typeContainer, spanManipulater, isDetectDelimiterEnable, isReplicateAuto, data) {
    const BLOCK_THRESHOLD = 100,
        newSpan = spanManipulater.create(data.selection, data.spanConfig);

    // The span cross exists spans.
    if (isBoundaryCrossingWithOtherSpans(
            model.annotationData.span.all(),
            newSpan
        )) {
        return;
    }

    // The span exists already.
    if (isAlreadySpaned(model.annotationData.span.all(), newSpan)) {
        return;
    }

    const commands = [command.factory.spanCreateCommand(
        typeContainer.entity.getDefaultType(), {
            begin: newSpan.begin,
            end: newSpan.end
        }
    )];

    if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
        commands.push(
            command.factory.spanReplicateCommand(
                typeContainer.entity.getDefaultType(), {
                    begin: newSpan.begin,
                    end: newSpan.end
                },
                isDetectDelimiterEnable ? data.spanConfig.isDelimiter : null
            )
        );
    }

    command.invoke(commands);
}

function expandSpanToSelection(editor, model, command, spanManipulater, spanId, data) {
    const newSpan = spanManipulater.expand(spanId, data.selection, data.spanConfig);

    // The span cross exists spans.
    if (isBoundaryCrossingWithOtherSpans(
            model.annotationData.span.all(),
            newSpan
        )) {
        deferAlert('A span cannot be expanded to make a boundary crossing.');
        return;
    }

    command.invoke(moveSpan(editor, command, spanId, newSpan));
}

function DoExpand(model, selectionParser, expandSpanToSelection, data) {
    // If a span is selected, it is able to begin drag a span in the span and expand the span.
    // The focus node should be at one level above the selected node.
    if (selectionParser.isAnchorInSelectedSpan(data.selection)) {
        // cf.
        // 1. one side of a inner span is same with one side of the outside span.
        // 2. Select an outside span.
        // 3. Begin Drug from an inner span to out of an outside span.
        // Expand the selected span.
        expandSpanToSelection(model.selectionModel.span.single(), data);
    } else if (selectionParser.isAnchorOneDownUnderForcus(data.selection)) {
        // To expand the span , belows are needed:
        // 1. The anchorNode is in the span.
        // 2. The foucusNode is out of the span and in the parent of the span.
        expandSpanToSelection(data.selection.anchorNode.parentNode.id, data);
    } else {
        return data;
    }
}

function shrinkSpanToSelection(editor, model, command, spanManipulater, spanId, data) {
    const newSpan = spanManipulater.shrink(spanId, data.selection, data.spanConfig);

    // The span cross exists spans.
    if (isBoundaryCrossingWithOtherSpans(
            model.annotationData.span.all(),
            newSpan
        )) {
        deferAlert('A span cannot be shrinked to make a boundary crossing.');
        return;
    }

    const newSpanId = idFactory.makeSpanId(editor, newSpan),
        sameSpan = model.annotationData.span.get(newSpanId);

    command.invoke(
        newSpan.begin < newSpan.end && !sameSpan ?
        moveSpan(editor, command, spanId, newSpan) :
        removeSpan(command, spanId)
    );
}

function DoShrink(model, selectionParser, doShrinkSpanToSelection, data) {
    if (selectionParser.isFocusInSelectedSpan(data.selection)) {
        // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
        // The focus node should be at the selected node.
        // cf.
        // 1. Select an inner span.
        // 2. Begin Drug from out of an outside span to the selected span.
        // Shrink the selected span.
        doShrinkSpanToSelection(model.selectionModel.span.single(), data);
    } else if (selectionParser.isForcusOneDownUnderAnchor(data.selection)) {
        // To shrink the span , belows are needed:
        // 1. The anchorNode out of the span and in the parent of the span.
        // 2. The foucusNode is in the span.
        doShrinkSpanToSelection(data.selection.focusNode.parentNode.id, data);
    }
}
