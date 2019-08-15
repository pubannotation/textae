export default function(history, buttonStateHelper, leaveMessage) {
  history.on('change', () => {
    // change button state
    buttonStateHelper.enabled('undo', history.hasAnythingToUndo)
    buttonStateHelper.enabled('redo', history.hasAnythingToRedo)
    // change leaveMessage show
    window.onbeforeunload = history.hasAnythingToSaveAnnotation
      ? () => leaveMessage
      : null
  })
}
