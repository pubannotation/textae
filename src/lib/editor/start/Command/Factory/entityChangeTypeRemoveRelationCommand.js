import {
  RemoveCommand
}
from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(model, id, newType, isRemoveRelations) {
  // isRemoveRelations is set true when newType is block.
  const changeType = new ChangeTypeCommand(model.annotationData, 'entity', id, newType),
    subCommands = isRemoveRelations ?
    model.annotationData.entity.assosicatedRelations(id)
    .map((id) => new RemoveCommand(model.annotationData, model.selectionModel, 'relation', id))
    .concat(changeType) : [changeType]

  return {
    execute: function() {
      executeCompositCommand('entity', this, 'change', id, subCommands)
    }
  }
}
