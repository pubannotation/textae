import getNewSpan from './getNewSpan'
import clearTextSelectionAndAlert from '../../../../../clearTextSelectionAndAlert'

export default function(
  selectionModel,
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  selectionModel.clear()

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

  commander.invoke(commander.factory.moveSpanCommand(spanId, begin, end))
}
