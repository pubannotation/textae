import clearTextSelectionAndAlert from '../../../../../../clearTextSelectionAndAlert'
import getNewSpan from './getNewSpan'

export default function(
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const { begin, end } = getNewSpan(
    annotationData,
    spanAdjuster,
    spanId,
    selectionWrapper,
    spanConfig
  )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    clearTextSelectionAndAlert(
      'A span cannot be shrinked to make a boundary crossing.'
    )
    return false
  }

  const doesExists = annotationData.span.hasDenotationSpan(begin, end)

  if (begin < end && !doesExists) {
    commander.invoke(commander.factory.moveSpanCommand(spanId, begin, end))
  } else {
    commander.invoke(commander.factory.removeSpanCommand(spanId))
    return true
  }

  return false
}
