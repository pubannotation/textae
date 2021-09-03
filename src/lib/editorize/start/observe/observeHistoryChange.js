import isTouchDevice from '../../isTouchDevice'

export default function (editor) {
  editor.eventEmitter.on('textae-event.history.change', (history) => {
    // change leaveMessage show
    // Reloading when trying to scroll further when you are at the top on an Android device.
    // Show a confirmation dialog to prevent this.
    window.onbeforeunload =
      isTouchDevice() || history.hasAnythingToSaveAnnotation ? () => true : null
  })
}
