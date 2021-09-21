export default function (editor) {
  editor[0].addEventListener('keyup', (event) => {
    editor.eventEmitter.emit('textae-event.editor.key.input')
    editor.instanceMethods.handleKeyInput(event)
  })
}
