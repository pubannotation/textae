import { isBoundaryCrossingWithOtherSpans } from '../../../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import deferAlert from '../../../deferAlert'
import getNewSpan from './getNewSpan'

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
    command.invoke(command.factory.spanMoveCommand(spanId, newSpan))
  } else {
    command.invoke(command.factory.spanRemoveCommand(spanId))
    return true
  }

  return false
}
