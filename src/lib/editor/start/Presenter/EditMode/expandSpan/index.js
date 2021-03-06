import getNewSpan from './getNewSpan'
import clearTextSelectionAndAlert from '../clearTextSelectionAndAlert'

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
      'A span cannot be expanded to make a boundary crossing.'
    )
    return
  }

  // A span cannot be expanded a span to the same as an existing span.
  if (annotationData.span.hasDenotationSpan(begin, end)) {
    return
  }

  okHandler(begin, end)
}
