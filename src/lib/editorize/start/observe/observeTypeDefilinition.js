export default function (editor, history) {
  editor.eventEmitter.on('textae-event.type-definition.reset', () =>
    history.resetConfiguration()
  )
}
