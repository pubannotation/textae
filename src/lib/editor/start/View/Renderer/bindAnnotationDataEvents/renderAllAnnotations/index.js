import getAnnotationBox from '../../getAnnotationBox'
import renderAllSpan from './renderAllSpan'

export default function (editor, annotationData, spanRenderer) {
  getAnnotationBox(editor).empty()
  renderAllSpan(annotationData, spanRenderer)
}
