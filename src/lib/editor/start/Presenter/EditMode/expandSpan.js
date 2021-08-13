import validateNewSpan from './EditDenotation/SpanEditor/validateNewSpan'

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

  if (validateNewSpan(annotationData, begin, end)) {
    okHandler(begin, end)
  }
}
