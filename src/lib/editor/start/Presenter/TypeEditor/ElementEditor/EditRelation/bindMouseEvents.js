import entityClickedAtRelationMode from './entityClickedAtRelationMode'

// Manupulate only entities and relations on the Edit Relation mode.
export default function(editor, selectionModel, command, typeContainer, cancelSelect) {
  editor
    .on('mouseup', '.textae-editor__entity', (e) => {
      const ret = entityClickedAtRelationMode(selectionModel, command, typeContainer, e)
      return ret
    })
    // Cancel event handlers of mouseup events of relations and theier label.
    // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
    // And jQuery click events will  propagate to the body element and cancel selection.
    // So multi selection of relations with Ctrl-key is not work.
    .on('mouseup', '.textae-editor__relation, .textae-editor__relation__label', () => false)
    .on('mouseup', '.textae-editor__body', cancelSelect)
}
