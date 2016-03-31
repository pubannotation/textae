import {
  isBoundaryCrossingWithOtherSpans as isBoundaryCrossingWithOtherSpans
}
from '../../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import deferAlert from '../../deferAlert'
import idFactory from '../../../../../../idFactory'
import moveSpan from './../moveSpan'
import * as selectPosition from '../../selectPosition'

export default function(editor, model, command, spanAdjuster, spanId, selection, spanConfig) {
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

function getNewSpan(model, spanAdjuster, spanId, selection, spanConfig) {
  const anchorPosition = selectPosition.getAnchorPosition(model.annotationData, selection),
    focusPosition = selectPosition.getFocusPosition(model.annotationData, selection)

  return getNewShortSpan(model, spanAdjuster, spanId, anchorPosition, focusPosition, spanConfig)
}

function removeSpan(command, spanId) {
  return [command.factory.spanRemoveCommand(spanId)]
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
