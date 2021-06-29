import alertifyjs from 'alertifyjs'

export default function (editor, editMode, mode) {
  editor.eventEmitter.on(
    'textae-event.annotation-data.all.change',
    (_, multitrack) => {
      if (mode !== 'edit') {
        editMode.forView()
      } else {
        if (multitrack) {
          alertifyjs.success(
            'track annotations have been merged to root annotations.'
          )
        }
        editMode.forEditable()
      }
    }
  )
}
