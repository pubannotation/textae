import {
  RemoveCommand, ChangeTypeCommand
}
from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'

export default function(model, id, newType, isRemoveRelations) {
  const relationRemoveCommand = (relation) => new RemoveCommand(model, 'relation', relation),
    // isRemoveRelations is set true when newType is block.
    changeType = new ChangeTypeCommand(model, 'entity', id, newType),
    subCommands = isRemoveRelations ?
    model.annotationData.entity.assosicatedRelations(id)
    .map(function(id) {
      return relationRemoveCommand(id)
    })
    .concat(changeType) : [changeType]

  return {
    execute: function() {
      executeCompositCommand('entity', this, 'change', id, subCommands)
    }
  }
}
