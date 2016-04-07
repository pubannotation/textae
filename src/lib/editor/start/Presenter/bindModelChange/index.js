import * as changeEditMode from '../changeEditMode'
import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode'
import updateWritable from './updateWritable'

export default function(annotationData, writable, editMode) {
  annotationData
    .on('all.change', (annotationData, multitrack, reject) => updateWritable(multitrack, reject, writable))
    .on('all.change', (annotationData, multitrack) => {
      if (editMode.isView()) {
        changeEditMode.forView(editMode, annotationData)
      } else {
        showLoadNoticeForEditableMode(multitrack)
        changeEditMode.forEditable(editMode, annotationData)
      }
    })
}
