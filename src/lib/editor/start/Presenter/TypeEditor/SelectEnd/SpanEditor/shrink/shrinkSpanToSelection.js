import { isBoundaryCrossingWithOtherSpans } from '../../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import deferAlert from '../../deferAlert'
import * as selectPosition from '../../selectPosition'

export default function(
  annotationData,
  command,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    spanId,
    selection,
    spanConfig
  )

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(annotationData.span.all, newSpan)) {
    deferAlert('A span cannot be shrinked to make a boundary crossing.')
    return false
  }

  const doesExists = annotationData.span.has(newSpan)

  if (newSpan.begin < newSpan.end && !doesExists) {
    command.invoke([command.factory.spanMoveCommand(spanId, newSpan)])
  } else {
    command.invoke(removeSpan(command, spanId))
    return true
  }

  return false
}

function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const anchorPosition = selectPosition.getAnchorPosition(
    annotationData,
    selection
  )
  const focusPosition = selectPosition.getFocusPosition(
    annotationData,
    selection
  )

  return getNewShortSpan(
    annotationData,
    spanAdjuster,
    spanId,
    anchorPosition,
    focusPosition,
    spanConfig
  )
}

function removeSpan(command, spanId) {
  return [command.factory.spanRemoveCommand(spanId)]
}

function getNewShortSpan(
  annotationData,
  spanAdjuster,
  spanId,
  anchorPosition,
  focusPosition,
  spanConfig
) {
  const span = annotationData.span.get(spanId)

  if (anchorPosition < focusPosition) {
    // shorten the left boundary
    if (span.end === focusPosition)
      return {
        begin: span.end,
        end: span.end
      }

    return {
      begin: spanAdjuster.forwardFromBegin(
        annotationData.sourceDoc,
        focusPosition,
        spanConfig
      ),
      end: span.end
    }
  } else {
    // shorten the right boundary
    if (span.begin === focusPosition)
      return {
        begin: span.begin,
        end: span.begin
      }

    return {
      begin: span.begin,
      end:
        spanAdjuster.backFromEnd(
          annotationData.sourceDoc,
          focusPosition - 1,
          spanConfig
        ) + 1
    }
  }
}
