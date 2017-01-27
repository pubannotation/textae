import {
  RemoveCommand
}
from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'
import relationAndAssociatesRemoveCommand from './relationAndAssociatesRemoveCommand'


export default function(annotationData, selectionModel, id) {
  const entityRemoveCommand = (entity) => new RemoveCommand(annotationData, selectionModel, 'entity', entity),
    removeEntity = entityRemoveCommand(id),
    removeRelation = annotationData.entity.assosicatedRelations(id)
    .map((id) => relationAndAssociatesRemoveCommand(annotationData, selectionModel, id)),
    removeModification = annotationData.getModificationOf(id)
    .map((modification) => modification.id)
    .map((id) => new RemoveCommand(annotationData, selectionModel, 'modification', id)),
    subCommands = removeRelation.concat(removeModification).concat(removeEntity)

  return {
    execute: function() {
      executeCompositCommand('entity', this, 'remove', id, subCommands)
    }
  }
}
