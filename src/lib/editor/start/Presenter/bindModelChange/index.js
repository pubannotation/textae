import forView from './forView'
import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode'
import forEditable from './forEditable'

export default function (editor, editMode, mode) {
  editor.eventEmitter.on(
    'textae-event.annotationData.all.change',
    (annotationData, multitrack) => {
      if (mode !== 'edit') {
        forView(editMode, annotationData)
      } else {
        showLoadNoticeForEditableMode(multitrack)
        forEditable(editMode, annotationData)
      }
    }
  )
}
