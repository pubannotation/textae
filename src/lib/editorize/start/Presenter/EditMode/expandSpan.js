import validateNewDennotationSpan from './EditDenotation/SpanEditor/validateNewDennotationSpan'

export default function (
  selectionModel,
  annotationData,
  spanAdjuster,
  spanID,
  selectionWrapper,
  spanConfig,
  okHandler
) {
  selectionModel.removeAll()

  const { begin, end } = annotationData.span
    .get(spanID)
    .getExpandedInAnchorNodeToFocusNodeDirection(
      spanAdjuster,
      selectionWrapper,
      annotationData.sourceDoc,
      spanConfig
    )

  if (validateNewDennotationSpan(annotationData, begin, end)) {
    okHandler(begin, end)
  }
}
