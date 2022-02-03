import alertifyjs from 'alertifyjs'

export default function (
  spanModelContainer,
  sourceDoc,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig,
  moveHandler
) {
  const { begin, end } = spanModelContainer
    .get(spanId)
    .getShotrenInAnchorNodeToFocusNodeDirection(
      spanAdjuster,
      selectionWrapper,
      sourceDoc,
      spanConfig
    )

  // The span cross exists spans.
  if (spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be shrinked to make a boundary crossing.')
    return false
  }

  const doesExists = spanModelContainer.hasDenotationSpan(begin, end)

  if (begin < end && !doesExists) {
    moveHandler(begin, end)
  } else {
    commander.invoke(commander.factory.removeSpanCommand(spanId))
    return true
  }

  return false
}
