import getNewSpan from './getNewSpan'
import clearTextSelectionAndAlert from '../../../../clearTextSelectionAndAlert'

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

  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    spanId,
    selectionWrapper,
    spanConfig
  )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(newSpan)) {
    clearTextSelectionAndAlert(
      'A span cannot be expanded to make a boundary crossing.'
    )
    return
  }

  // A span cannot be expanded a span to the same as an existing span.
  if (annotationData.span.isAlreadySpaned(newSpan)) {
    return
  }

  commander.invoke(commander.factory.moveSpanCommand(spanId, newSpan))
}
