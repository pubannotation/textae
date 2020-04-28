import delegate from 'delegate'
import bindEditorBodyClickEventTrigger from '../bindEditorBodyClickEventTrigger'

// Manupulate only entities and relations on the Edit Relation mode.
// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function(editor) {
  const listeners = []

  listeners.push(bindEditorBodyClickEventTrigger(editor))

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editRelation.entity.click', e)
    )
  )

  // Cancel event handlers of click events of relations and theier label.
  // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
  // And jQuery click events will  propagate to the body element and cancel selection.
  // So multi selection of relations with Ctrl-key is not work.
  listeners.push(
    delegate(
      editor[0],
      '.textae-editor__relation, .textae-editor__relation__label',
      'click',
      (e) =>
        editor.eventEmitter.emit(
          'textae.editor.editRelation.relationLabel.click',
          e
        )
    )
  )

  return listeners
}
