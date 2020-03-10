import delegate from 'delegate'
import entityClickedAtRelationMode from './entityClickedAtRelationMode'

// Manupulate only entities and relations on the Edit Relation mode.
// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function(editor, selectionModel, commander, typeDefinition) {
  const listeners = []

  // Trigger body click event
  // The blank area on the editor is textae-editor__body__text-box or textae-editor__body__text-box__paragraph-margin.
  listeners.push(
    delegate(editor[0], '.textae-editor__body__text-box', 'click', (e) => {
      // The delegate also fires events for child elements of the selector.
      // Ignores events that occur in child elements.
      // Otherwise, you cannot select child elements.
      if (
        e.target.classList.contains('textae-editor__body__text-box') ||
        e.target.classList.contains(
          'textae-editor__body__text-box__paragraph-margin'
        )
      ) {
        editor.eventEmitter.emit('textae.editor.body.click')
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', (e) => {
      const ret = entityClickedAtRelationMode(
        selectionModel,
        commander,
        typeDefinition,
        e
      )
      return ret
    })
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
      (e) => e.stopPropagation()
    )
  )

  return listeners
}
