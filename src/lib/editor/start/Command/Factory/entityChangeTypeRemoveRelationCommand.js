import {
  RemoveCommand
}
from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, annotationData, selectionModel, id, newType, isRemoveRelations) {
  // isRemoveRelations is set true when newType is block.
  const changeType = new ChangeTypeCommand(editor, annotationData, 'entity', id, newType),
    subCommands = isRemoveRelations ?
    annotationData.entity.assosicatedRelations(id)
    .map((id) => new RemoveCommand(editor, annotationData, selectionModel, 'relation', id))
    .concat(changeType) : [changeType]

  return {
    execute: function() {
      executeCompositCommand('entity', this, 'change', id, subCommands)
    }
  }
}
