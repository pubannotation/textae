import alertifyjs from 'alertifyjs'

export default function (
  selectionModel,
  annotationData,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig,
  okHandler
) {
  selectionModel.removeAll()

  const { begin, end } = annotationData.span
    .get(spanId)
    .getExpandedInAnchorNodeToFocusNodeDirection(
      spanAdjuster,
      selectionWrapper,
      annotationData.sourceDoc,
      spanConfig
    )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be expanded to make a boundary crossing.')
    return
  }

  // A span cannot be expanded a span to the same as an existing span.
  if (annotationData.span.hasDenotationSpan(begin, end)) {
    return
  }

  okHandler(begin, end)
}
