export default function (editor) {
  editor[0].addEventListener('keyup', (event) => {
    editor.eventEmitter.emit('textae.editor.key.input')
    editor.api.handleKeyInput(event)
  })
}
