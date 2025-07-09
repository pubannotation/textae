import getRightSpanElement from '../../../../getRightSpanElement'
import shrinkSpanToSelection from './shrinkSpanToSelection'

export default function (
  editorHTMLElement,
  annotationModel,
  sourceDoc,
  selectionModel,
  commander,
  textSelectionAdjuster,
  spanId,
  spanConfig,
  moveHandler
) {
  if (spanId) {
    selectionModel.removeAll()

    // Get the next span before removing the old span.
    const nextSpan = getRightSpanElement(editorHTMLElement, spanId)
    const removed = shrinkSpanToSelection(
      annotationModel.spanInstanceContainer,
      sourceDoc,
      commander,
      textSelectionAdjuster,
      spanId,
      spanConfig,
      moveHandler
    )

    if (removed && nextSpan) {
      selectionModel.selectSpan(nextSpan.id)
    }
  }
}
