import isRelation from '../isRelation'
import isSpanEdit from '../isSpanEdit'
import isView from '../isView'

export default function(editor, state) {
  editor.eventEmitter
    .on('textae.history.change', (history) => {
      // change button state
      state.enabled('undo', history.hasAnythingToUndo)
      state.enabled('redo', history.hasAnythingToRedo)
    })
    .on('textae.selection.span.change', () => state.updateBySpan())
    .on('textae.selection.relation.change', () => state.updateByRelation())
    .on('textae.selection.entity.change', () => state.updateByEntity())
    .on('textae.editMode.transition', (mode, editable) => {
      state.enabled('simple', !isRelation(mode))
      state.enabled('replicate-auto', isSpanEdit(mode, editable))
      state.enabled('boundary-detection', isSpanEdit(mode, editable))
      state.enabled('line-height', editable)
      state.enabled('line-height-auto', editable)
      state.enabled('pallet', !isView(editable))
    })
    .on('textae.clipBoard.change', () =>
      state.enabled('paste', state._enablePaste)
    )
    .on('textae.annotationAutoSaver.enable', (enable) =>
      state.enabled('write-auto', enable)
    )
}
