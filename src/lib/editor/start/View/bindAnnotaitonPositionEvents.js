export default function (editor, cursorChanger) {
  // Set cursor control by view rendering events.
  editor.eventEmitter
    .on('textae.annotationPosition.position-update.start', () =>
      cursorChanger.startWait()
    )
    .on('textae.annotationPosition.position-update.end', () =>
      cursorChanger.endWait()
    )
}
