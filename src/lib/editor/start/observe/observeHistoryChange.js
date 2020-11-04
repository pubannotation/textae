export default function (editor) {
  editor.eventEmitter.on('textae.history.change', (history) => {
    // change leaveMessage show
    window.onbeforeunload = history.hasAnythingToSaveAnnotation
      ? () => true
      : null
  })
}
