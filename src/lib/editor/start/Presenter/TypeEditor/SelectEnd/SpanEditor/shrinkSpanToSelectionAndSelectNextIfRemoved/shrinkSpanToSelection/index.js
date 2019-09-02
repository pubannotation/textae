import { isBoundaryCrossingWithOtherSpans } from '../../../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import deferAlert from '../../../deferAlert'
import getNewSpan from './getNewSpan'

export default function(
  annotationData,
  commander,
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
    commander.invoke(commander.factory.spanMoveCommand(spanId, newSpan))
  } else {
    commander.invoke(commander.factory.spanRemoveCommand(spanId))
    return true
  }

  return false
}
