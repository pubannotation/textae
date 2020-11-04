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
  selectionModel
) {
  // Get the next span before removing the old span.
  const nextSpan = getRightSpanElement(editor[0], spanId)
  const removed = shrinkSpanToSelection(
    annotationData,
    commander,
    spanAdjuster,
    spanId,
    selectionWrapper,
    spanConfig
  )

  if (removed && nextSpan) {
    selectionModel.selectSpan(nextSpan.id)
  }
}
