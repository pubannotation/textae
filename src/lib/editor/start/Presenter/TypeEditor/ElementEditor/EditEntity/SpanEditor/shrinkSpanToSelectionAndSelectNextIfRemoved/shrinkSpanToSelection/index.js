import clearTextSelectionAndAlert from '../../../../../clearTextSelectionAndAlert'
import getNewSpan from './getNewSpan'

export default function(
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    spanId,
    selectionWrapper,
    spanConfig
  )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(newSpan)) {
    clearTextSelectionAndAlert(
      'A span cannot be shrinked to make a boundary crossing.'
    )
    return false
  }

  const doesExists = annotationData.span.has(newSpan)

  if (newSpan.begin < newSpan.end && !doesExists) {
    commander.invoke(commander.factory.moveSpanCommand(spanId, newSpan))
  } else {
    commander.invoke(commander.factory.removeSpanCommand(spanId))
    return true
  }

  return false
}
