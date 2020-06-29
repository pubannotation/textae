export default function(editor, history) {
  editor.eventEmitter.on('textae.typeDefinition.reset', () =>
    history.resetConfiguration()
  )
}
