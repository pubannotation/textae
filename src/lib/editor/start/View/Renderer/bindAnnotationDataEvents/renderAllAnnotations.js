import getAnnotationBox from '../getAnnotationBox'
import renderAllRelation from './renderAllRelation'
import renderAllSpan from './renderAllSpan'
export default function(
  editor,
  domPositionCache,
  annotationData,
  spanRenderer,
  relationRenderer
) {
  getAnnotationBox(editor).empty()
  domPositionCache.gridPositionCache.clear()
  renderAllSpan(annotationData, spanRenderer)
  renderAllRelation(annotationData, relationRenderer)
}
