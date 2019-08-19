import isSimple from '../isSimple'

export default function(editMode, annotationData) {
  if (isSimple(annotationData)) {
    editMode.toTerm()
  } else {
    editMode.toInstance()
  }
}
