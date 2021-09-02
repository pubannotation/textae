import getRightSpanElement from '../../../../getRightSpanElement'
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
    selectionModel.removeAll()

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
}
