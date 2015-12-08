import {
  RemoveCommand
}
from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'

export default function(model, id) {
  const entityRemoveCommand = (entity) => new RemoveCommand(model, 'entity', entity),
    modificationRemoveCommand = (modification) => new RemoveCommand(model, 'modification', modification),
    relationRemoveCommand = (relation) => new RemoveCommand(model, 'relation', relation),
    removeEntity = entityRemoveCommand(id),
    removeRelation = model.annotationData.entity.assosicatedRelations(id)
    .map(function(id) {
      return relationRemoveCommand(id)
    }),
    removeModification = model.annotationData.getModificationOf(id)
    .map(function(modification) {
      return modification.id
    })
    .map(function(id) {
      return modificationRemoveCommand(id)
    }),
    subCommands = removeRelation.concat(removeModification).concat(removeEntity)

  return {
    execute: function() {
      executeCompositCommand('entity', this, 'remove', id, subCommands)
    }
  }
}
