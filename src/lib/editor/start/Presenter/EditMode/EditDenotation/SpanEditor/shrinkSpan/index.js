import getRightSpanElement from '../../../../../../getRightSpanElement'
import shrinkSpanToSelection from './shrinkSpanToSelection'

export default function (
  editor,
  annotationData,
  selectionModel,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig,
  moveHandler
) {
  if (spanId) {
    selectionModel.clear()

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
      selectionModel.selectSpanEx(nextSpan.id)
    }
  }
}
