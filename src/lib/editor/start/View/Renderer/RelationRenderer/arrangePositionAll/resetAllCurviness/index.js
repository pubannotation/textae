import resetCurviness from './resetCurviness'

export default function(editor, annotationData, relations) {
  for (const relation of relations) {
    resetCurviness(relation, editor, annotationData)
  }
}
