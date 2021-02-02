export default function (editor, cursorChanger) {
  // Set cursor control by view rendering events.
  editor.eventEmitter
    .on('textae-event.annotation-position.position-update.start', () =>
      cursorChanger.startWait()
    )
    .on('textae-event.annotation-position.position-update.end', () =>
      cursorChanger.endWait()
    )
}
