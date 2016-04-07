import * as changeEditMode from '../changeEditMode'

export default function(mode, editMode, annotationData) {
  // Set the mode according to params at 1st time.
  if (mode !== 'edit') {
    changeEditMode.forView(editMode, annotationData)
  } else {
    changeEditMode.forEditable(editMode, annotationData)
  }
}
