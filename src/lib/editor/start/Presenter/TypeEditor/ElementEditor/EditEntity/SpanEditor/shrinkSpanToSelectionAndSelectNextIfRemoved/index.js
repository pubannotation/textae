import shrinkSpanToSelection from './shrinkSpanToSelection'
import { getRightElement } from '../../../../../../getNextElement'

export default function(
  editor,
  annotationData,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig,
  selectionModel
) {
  const oldSpan = document.querySelector(`#${spanId}`)
  // Get the next span before removing the old span.
  const nextSpan = getRightElement(editor[0], oldSpan, 'textae-editor__span')
  const removed = shrinkSpanToSelection(
    annotationData,
    commander,
    spanAdjuster,
    spanId,
    selectionWrapper,
    spanConfig
  )

  if (removed && nextSpan) {
    selectionModel.selectSingleSpanById(nextSpan.id)
  }
}
