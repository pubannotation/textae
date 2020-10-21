import delegate from 'delegate'
import bindEditorBodyClickEventTrigger from '../bindEditorBodyClickEventTrigger'

// Manupulate only entities and relations on the Edit Relation mode.
// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function(editor) {
  const listeners = []

  listeners.push(
    delegate(editor[0], '.textae-editor__body__text-box', 'click', (e) => {
      if (e.target.classList.contains('textae-editor__body__text-box')) {
        editor.eventEmitter.emit('textae.editor.editRelation.textBox.click', e)
      }
    })
  )

  listeners.push(bindEditorBodyClickEventTrigger(editor))

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editRelation.entity.click', e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity__type-values', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editRelation.typeValues.click', e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity__endpoint', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editRelation.endpoint.click', e)
    )
  )

  return listeners
}
