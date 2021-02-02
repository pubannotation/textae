export default function (editor, history) {
  editor.eventEmitter.on('textae-event.typeDefinition.reset', () =>
    history.resetConfiguration()
  )
}
