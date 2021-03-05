import getAnnotationBox from '../../../../../getAnnotationBox'

export default function (editor, annotationData, spanRenderer) {
  getAnnotationBox(editor).innerHTML = ''
  for (const span of annotationData.span.topLevel) {
    spanRenderer.render(span)
  }
}
