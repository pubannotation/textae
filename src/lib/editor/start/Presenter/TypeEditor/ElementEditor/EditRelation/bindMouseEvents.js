import entityClickedAtRelationMode from './entityClickedAtRelationMode'

// Manupulate only entities and relations on the Edit Relation mode.
export default function(
  editor,
  selectionModel,
  command,
  typeDefinition,
  cancelSelect
) {
  // For support context menu.
  // Mouse up event occurs when either left or right button is clicked.
  // Change mouse events to monitor from mouseup to click since v5.0.0.
  editor
    .on('click', '.textae-editor__entity', (e) => {
      const ret = entityClickedAtRelationMode(
        selectionModel,
        command,
        typeDefinition,
        e
      )
      return ret
    })
    // Cancel event handlers of click events of relations and theier label.
    // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
    // And jQuery click events will  propagate to the body element and cancel selection.
    // So multi selection of relations with Ctrl-key is not work.
    .on(
      'click',
      '.textae-editor__relation, .textae-editor__relation__label',
      () => false
    )
    .on('click', '.textae-editor__body', cancelSelect)
}
