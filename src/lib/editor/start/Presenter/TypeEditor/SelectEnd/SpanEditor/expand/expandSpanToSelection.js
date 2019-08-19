import { isBoundaryCrossingWithOtherSpans } from '../../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import deferAlert from '../../deferAlert'
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
    deferAlert('A span cannot be expanded to make a boundary crossing.')
    return
  }

  command.invoke([command.factory.spanMoveCommand(spanId, newSpan)])
}
