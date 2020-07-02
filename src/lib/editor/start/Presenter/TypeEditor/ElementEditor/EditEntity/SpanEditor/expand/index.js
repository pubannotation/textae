import getNewSpan from './getNewSpan'
import isBoundaryCrossingWithOtherSpans from '../../../../../../../isBoundaryCrossingWithOtherSpans'
import clearTextSelectionAndAlert from '../../../../clearTextSelectionAndAlert'

export default function(
  selectionModel,
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  selectionModel.clear()

  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    spanId,
    selection,
    spanConfig
  )

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(annotationData.span.all, newSpan)) {
    clearTextSelectionAndAlert(
      'A span cannot be expanded to make a boundary crossing.'
    )
    return
  }

  // A span cannot be expanded a span to the same as an existing span.
  if (annotationData.span.has(newSpan)) {
    return
  }

  commander.invoke(commander.factory.moveSpanCommand(spanId, newSpan))
}
