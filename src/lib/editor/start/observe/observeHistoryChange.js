export default function (editor) {
  editor.eventEmitter.on('textae-event.history.change', (history) => {
    // change leaveMessage show
    window.onbeforeunload = history.hasAnythingToSaveAnnotation
      ? () => true
      : null
  })
}
