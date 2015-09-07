import AnnotationData from './AnnotationData'
import Selection from './Selection'

export default function(editor) {
  return {
    annotationData: new AnnotationData(editor),
    // A contaier of selection state.
    selectionModel: new Selection(['span', 'entity', 'relation'])
  }
}
