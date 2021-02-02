import delgate from 'delegate'

export default function (content, editor) {
  delgate(content, '.reset-hidden-message-boxes', 'click', () =>
    editor.eventEmitter.emit('textae-event.message-box.show')
  )
}
