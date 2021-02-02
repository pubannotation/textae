export default function (editor, button) {
  editor.eventEmitter
    .on('textae-event.history.change', (history) => {
      // change button state
      button.enable('undo', history.hasAnythingToUndo)
      button.enable('redo', history.hasAnythingToRedo)
    })
    .on('textae-event.selection.span.change', () => button.updateBySpan())
    .on('textae-event.selection.relation.change', () =>
      button.updateByRelation()
    )
    .on('textae-event.selection.entity.change', () => button.updateByEntity())
    .on('textae-event.edit-mode.transition', (mode) => button.setForMode(mode))
    .on('textae-event.clip-board.change', () => button.updateByClipboard)
    .on('textae-event.annotation-auto-saver.enable', (enable) =>
      button.enable('write-auto', enable)
    )
}
