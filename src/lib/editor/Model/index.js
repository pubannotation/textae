import AnnotationData from './AnnotationData'
import Selection from './Selection'

export default function(editor) {
  const annotationData = new AnnotationData(editor),
    // A contaier of selection state.
    selectionModel = new Selection(annotationData)

  return {
    annotationData,
    selectionModel
  }
}
