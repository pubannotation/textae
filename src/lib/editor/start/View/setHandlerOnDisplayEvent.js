import CursorChanger from '../../../util/CursorChanger'

export default function(editor, annotationPosition) {
  // Set cursor control by view rendering events.
  const cursorChanger = new CursorChanger(editor)

  annotationPosition
    .on('position-update.start', () => cursorChanger.startWait())
    .on('position-update.end', () => cursorChanger.endWait())
}
