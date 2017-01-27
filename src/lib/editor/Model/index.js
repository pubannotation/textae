import AnnotationData from './AnnotationData'

export default function(editor) {
  const annotationData = new AnnotationData(editor)

  return {
    annotationData
  }
}
