import entityClickedAtRelationMode from './entityClickedAtRelationMode'
import EditRelationHandler from './EditRelationHandler'

export default function(editor, annotationData, selectionModel, command, typeContainer, cancelSelect) {
  // Manupulate only entities and relations on the Edit Relation mode.
  let init = () => {
    editor
      .on('mouseup', '.textae-editor__entity', (e) => {
        const ret = entityClickedAtRelationMode(
          selectionModel,
          command,
          typeContainer,
          e
        )

        return ret
      })
      // Cancel event handlers of mouseup events of relations and theier label.
      // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
      // And jQuery click events will  propagate to the body element and cancel selection.
      // So multi selection of relations with Ctrl-key is not work.
      .on('mouseup', '.textae-editor__relation, .textae-editor__relation__label', () => false)
      .on('mouseup', '.textae-editor__body', cancelSelect)
  }

  return {
    init,
    handlers: new EditRelationHandler(typeContainer, command, annotationData, selectionModel)
  }
}
