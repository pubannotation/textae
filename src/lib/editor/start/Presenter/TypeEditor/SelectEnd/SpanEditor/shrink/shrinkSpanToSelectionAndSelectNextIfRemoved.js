import shrinkSpanToSelection from './shrinkSpanToSelection'
import { getRightElement } from '../../../../../getNextElement'

export default function(
  editor,
  annotationData,
  command,
  spanAdjuster,
  spanId,
  selection,
  spanConfig,
  selectionModel
) {
  const oldSpan = document.querySelector(`#${spanId}`)
  // Get the next span before removing the old span.
  const nextSpan = getRightElement(editor[0], oldSpan)
  const removed = shrinkSpanToSelection(
    annotationData,
    command,
    spanAdjuster,
    spanId,
    selection,
    spanConfig
  )

  if (removed && nextSpan) {
    selectionModel.selectSingleSpanById(nextSpan.id)
  }
}
