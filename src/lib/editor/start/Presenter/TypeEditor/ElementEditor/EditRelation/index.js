import entityClickedAtRelationMode from './entityClickedAtRelationMode'
import EditRelationHandler from './EditRelationHandler'

export default function(editor, selectionModel, annotationData, command, typeContainer, cancelSelect) {
  // Control only entities and relations.
  // Cancel events of relations and theier label.
  // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
  // And jQuery events are propergated to body click events and cancel select.
  // So multi selection of relations with Ctrl-key is not work.
  let init = () => {
    editor
      .on('mouseup', '.textae-editor__entity', (e) => entityClickedAtRelationMode(
        selectionModel,
        command,
        typeContainer,
        e
      ))
      .on('mouseup', '.textae-editor__relation, .textae-editor__relation__label', () => false)
      .on('mouseup', '.textae-editor__body', cancelSelect)
  }

  return {
    init,
    handlers: new EditRelationHandler(typeContainer, command, annotationData, selectionModel)
  }
}
