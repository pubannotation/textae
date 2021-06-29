import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode'

export default function (editor, editMode, mode) {
  editor.eventEmitter.on(
    'textae-event.annotation-data.all.change',
    (_, multitrack) => {
      if (mode !== 'edit') {
        editMode.forView()
      } else {
        showLoadNoticeForEditableMode(multitrack)
        editMode.forEditable()
      }
    }
  )
}
