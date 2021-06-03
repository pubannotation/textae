import clearTextSelectionAndAlert from '../../clearTextSelectionAndAlert'
import getShortenSpan from './getShortenSpan'

export default function (
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig,
  moveHandler
) {
  const { begin, end } = getShortenSpan(
    annotationData,
    spanAdjuster,
    selectionWrapper,
    spanConfig,
    spanId
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
    moveHandler(begin, end)
  } else {
    commander.invoke(commander.factory.removeSpanCommand(spanId))
    return true
  }

  return false
}
