import {
  RemoveCommand
}
from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'
import relationAndAssociatesRemoveCommand from './relationAndAssociatesRemoveCommand'


export default function(model, id) {
  const entityRemoveCommand = (entity) => new RemoveCommand(model.annotationData, model.selectionModel, 'entity', entity),
    removeEntity = entityRemoveCommand(id),
    removeRelation = model.annotationData.entity.assosicatedRelations(id)
      .map((id) => relationAndAssociatesRemoveCommand(model, id)),
      removeModification = model.annotationData.getModificationOf(id)
      .map((modification) => modification.id)
      .map((id) => new RemoveCommand(model.annotationData, model.selectionModel, 'modification', id)),
    subCommands = removeRelation.concat(removeModification).concat(removeEntity)

  return {
    execute: function() {
      executeCompositCommand('entity', this, 'remove', id, subCommands)
    }
  }
}
