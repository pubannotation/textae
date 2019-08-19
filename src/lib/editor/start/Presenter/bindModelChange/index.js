import forView from './forView'
import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode'
import forEditable from './forEditable'

export default function(annotationData, editMode, mode) {
  annotationData.on('all.change', (annotationData, multitrack) => {
    if (mode !== 'edit') {
      forView(editMode, annotationData)
    } else {
      showLoadNoticeForEditableMode(multitrack)
      forEditable(editMode, annotationData)
    }
  })
}
