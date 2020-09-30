import getAnnotationBox from '../../getAnnotationBox'
import renderAllSpan from './renderAllSpan'
export default function(
  editor,
  domPositionCache,
  annotationData,
  spanRenderer
) {
  getAnnotationBox(editor).empty()
  domPositionCache.removeAllGrid()
  renderAllSpan(annotationData, spanRenderer)
}
