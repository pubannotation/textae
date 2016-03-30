import idFactory from '../../../../../idFactory'
import {
  isBoundaryCrossingWithOtherSpans as isBoundaryCrossingWithOtherSpans
}
from '../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import deferAlert from '../deferAlert'
import selectPosition from '../selectPosition'
import * as isInSelected from './isInSelected'
import moveSpan from './moveSpan'

export default function(editor, model, command, spanAdjuster, selection, spanConfig) {
  const spanId = getShrinkTargetSpan(model, selection)

  if (spanId) {
    shrinkSpanToSelection(editor, model, command, spanAdjuster, spanId, selection, spanConfig)
  }
}

function getShrinkTargetSpan(model, selection) {
  if (isInSelected.isFocusInSelectedSpan(model, selection)) {
    // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
    // The focus node should be at the selected node.
    // cf.
    // 1. Select an inner span.
    // 2. Begin Drug from out of an outside span to the selected span.
    // Shrink the selected span.
    return model.selectionModel.span.single()
  } else if (isForcusOneDownUnderAnchor(selection)) {
    // To shrink the span , belows are needed:
    // 1. The anchorNode out of the span and in the parent of the span.
    // 2. The foucusNode is in the span.
    return selection.focusNode.parentNode.id
  }
}

function shrinkSpanToSelection(editor, model, command, spanAdjuster, spanId, selection, spanConfig) {
  model.selectionModel.clear()

  const newSpan = getNewSpan(model, spanAdjuster, spanId, selection, spanConfig)

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(
      model.annotationData.span.all(),
      newSpan
    )) {
    deferAlert('A span cannot be shrinked to make a boundary crossing.')
    return
  }

  const newSpanId = idFactory.makeSpanId(editor, newSpan),
    sameSpan = model.annotationData.span.get(newSpanId)

  command.invoke(
    newSpan.begin < newSpan.end && !sameSpan ?
    moveSpan(editor, command, spanId, newSpan) :
    removeSpan(command, spanId)
  )
}

function isForcusOneDownUnderAnchor(selection) {
  return selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode
}

function getNewSpan(model, spanAdjuster, spanId, selection, spanConfig) {
  const anchorPosition = selectPosition.getAnchorPosition(model.annotationData, selection),
    focusPosition = selectPosition.getFocusPosition(model.annotationData, selection)

  return getNewShortSpan(model, spanAdjuster, spanId, anchorPosition, focusPosition, spanConfig)
}

function getNewShortSpan(model, spanAdjuster, spanId, anchorPosition, focusPosition, spanConfig) {
  const span = model.annotationData.span.get(spanId)

  if (anchorPosition < focusPosition) {
    // shorten the left boundary
    if (span.end === focusPosition) return {
      begin: span.end,
      end: span.end
    }

    return {
      begin: spanAdjuster.forwardFromBegin(model.annotationData.sourceDoc, focusPosition, spanConfig),
      end: span.end
    }
  } else {
    // shorten the right boundary
    if (span.begin === focusPosition) return {
      begin: span.begin,
      end: span.begin
    }

    return {
      begin: span.begin,
      end: spanAdjuster.backFromEnd(model.annotationData.sourceDoc, focusPosition - 1, spanConfig) + 1
    }
  }
}

function removeSpan(command, spanId) {
  return [command.factory.spanRemoveCommand(spanId)]
}
