import delgate from 'delegate'

export default function (content, editor) {
  delgate(
    content,
    '.textae-editor__setting-dialog__reset-hidden-message-boxes-text',
    'click',
    () => editor.eventEmitter.emit('textae-event.message-box.show')
  )
}
