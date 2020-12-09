import shrinkSpanToSelection from './shrinkSpanToSelection'
import getRightSpanElement from '../../../../../../../getRightSpanElement'

export default function (
  editor,
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig,
  selectionModel,
  moveHandler
) {
  // Get the next span before removing the old span.
  const nextSpan = getRightSpanElement(editor, spanId)
  const removed = shrinkSpanToSelection(
    annotationData,
    commander,
    spanAdjuster,
    spanId,
    selectionWrapper,
    spanConfig,
    moveHandler
  )

  if (removed && nextSpan) {
    selectionModel.selectSpan(nextSpan.id)
  }
}
