import getAnnotationBox from '../../getAnnotationBox'
import renderAllSpan from './renderAllSpan'

export default function (editor, annotationData, spanRenderer) {
  getAnnotationBox(editor)[0].innerHTML = ''
  renderAllSpan(annotationData, spanRenderer)
}
