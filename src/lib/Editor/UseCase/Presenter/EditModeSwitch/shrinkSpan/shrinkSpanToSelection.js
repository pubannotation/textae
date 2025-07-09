import alertifyjs from 'alertifyjs'

/**
 *
 * @param {import('../../../../AnnotationModel/SpanInstanceContainer').default} spanInstanceContainer
 */
export default function shrinkSpanToSelection(
  annotationModel,
  sourceDoc,
  commander,
  textSelectionAdjuster,
  spanId,
  spanConfig,
  moveHandler
) {
  const { begin, end } = annotationModel
    .getSpan(spanId)
    .getShortenInAnchorNodeToFocusNodeDirection(
      textSelectionAdjuster,
      sourceDoc,
      spanConfig
    )

  // The span cross exists spans.
  if (annotationModel.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be shrunken to make a boundary crossing.')
    return false
  }

  const doesExists = annotationModel.findDenotation(begin, end)

  if (begin < end && !doesExists) {
    moveHandler(begin, end)
  } else {
    commander.invoke(commander.factory.removeSpanCommand(spanId))
    return true
  }

  return false
}
