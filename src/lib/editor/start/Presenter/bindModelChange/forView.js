import isSimple from '../isSimple'

export default function(editMode, annotationData) {
  if (isSimple(annotationData)) {
    editMode.toViewTerm()
  } else {
    editMode.toViewInstance()
  }
}
