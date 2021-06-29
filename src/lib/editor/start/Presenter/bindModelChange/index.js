import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode'
import forEditable from './forEditable'

export default function (editor, editMode, mode) {
  editor.eventEmitter.on(
    'textae-event.annotation-data.all.change',
    (annotationData, multitrack) => {
      if (mode !== 'edit') {
        editMode.forView()
      } else {
        showLoadNoticeForEditableMode(multitrack)
        forEditable(editMode, annotationData)
      }
    }
  )
}
