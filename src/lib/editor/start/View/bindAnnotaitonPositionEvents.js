export default function(annotationPosition, cursorChanger) {
  // Set cursor control by view rendering events.
  annotationPosition
    .on('position-update.start', () => cursorChanger.startWait())
    .on('position-update.end', () => cursorChanger.endWait())
}
