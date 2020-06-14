export default function(editor, leaveMessage) {
  editor.eventEmitter.on('textae.history.change', (history) => {
    // change leaveMessage show
    window.onbeforeunload = history.hasAnythingToSaveAnnotation
      ? () => leaveMessage
      : null
  })
}
