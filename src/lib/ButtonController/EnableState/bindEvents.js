import { MODE } from '../../MODE'

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
    .on('textae.editMode.transition', (mode) => {
      switch (mode) {
        case MODE.VIEW_WITHOUT_RELATION:
          state.enabled('simple', true)
          state.enabled('replicate-auto', false)
          state.enabled('boundary-detection', false)
          state.enabled('line-height', false)
          state.enabled('line-height-auto', false)
          state.enabled('pallet', false)
          break
        case MODE.VIEW_WITH_RELATION:
          state.enabled('simple', true)
          state.enabled('replicate-auto', false)
          state.enabled('boundary-detection', false)
          state.enabled('line-height', false)
          state.enabled('line-height-auto', false)
          state.enabled('pallet', false)
          break
        case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
          state.enabled('simple', true)
          state.enabled('replicate-auto', true)
          state.enabled('boundary-detection', true)
          state.enabled('line-height', true)
          state.enabled('line-height-auto', true)
          state.enabled('pallet', true)
          break
        case MODE.EDIT_DENOTATION_WITH_RELATION:
          state.enabled('simple', true)
          state.enabled('replicate-auto', true)
          state.enabled('boundary-detection', true)
          state.enabled('line-height', true)
          state.enabled('line-height-auto', true)
          state.enabled('pallet', true)
          break
        case MODE.EDIT_RELATION:
          state.enabled('simple', false)
          state.enabled('replicate-auto', false)
          state.enabled('boundary-detection', false)
          state.enabled('line-height', true)
          state.enabled('line-height-auto', true)
          state.enabled('pallet', true)
          break
        default:
          throw `unknown edit mode!${mode}`
      }
    })
    .on('textae.clipBoard.change', () =>
      state.enabled('paste', state._enablePaste)
    )
    .on('textae.annotationAutoSaver.enable', (enable) =>
      state.enabled('write-auto', enable)
    )
}
