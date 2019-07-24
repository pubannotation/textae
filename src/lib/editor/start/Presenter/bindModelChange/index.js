import * as changeEditMode from '../changeEditMode'
import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode'

export default function(annotationData, editMode, mode) {
  annotationData.on('all.change', (annotationData, multitrack) => {
    if (mode !== 'edit') {
      changeEditMode.forView(editMode, annotationData)
    } else {
      showLoadNoticeForEditableMode(multitrack)
      changeEditMode.forEditable(editMode, annotationData)
    }
  })
}
