export default function(editor, button) {
  editor.eventEmitter
    .on('textae.history.change', (history) => {
      // change button state
      button.enabled('undo', history.hasAnythingToUndo)
      button.enabled('redo', history.hasAnythingToRedo)
    })
    .on('textae.selection.span.change', () => button.updateBySpan())
    .on('textae.selection.relation.change', () => button.updateByRelation())
    .on('textae.selection.entity.change', () => button.updateByEntity())
    .on('textae.editMode.transition', (mode) => button.setForMode(mode))
    .on('textae.clipBoard.change', () =>
      button.enabled('paste', button._enablePaste)
    )
    .on('textae.annotationAutoSaver.enable', (enable) =>
      button.enabled('write-auto', enable)
    )
}
