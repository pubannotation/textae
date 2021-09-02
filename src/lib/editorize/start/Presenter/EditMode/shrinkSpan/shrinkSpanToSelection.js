import alertifyjs from 'alertifyjs'

export default function (
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig,
  moveHandler
) {
  const { begin, end } = annotationData.span
    .get(spanId)
    .getShotrenInAnchorNodeToFocusNodeDirection(
      spanAdjuster,
      selectionWrapper,
      annotationData.sourceDoc,
      spanConfig
    )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be shrinked to make a boundary crossing.')
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
