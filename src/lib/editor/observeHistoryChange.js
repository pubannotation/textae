export default function(editor, buttonStateHelper, leaveMessage) {
  editor.eventEmitter.on('textae.history.change', (history) => {
    // change button state
    buttonStateHelper.enabled('undo', history.hasAnythingToUndo)
    buttonStateHelper.enabled('redo', history.hasAnythingToRedo)
    // change leaveMessage show
    window.onbeforeunload = history.hasAnythingToSaveAnnotation
      ? () => leaveMessage
      : null
  })
}
