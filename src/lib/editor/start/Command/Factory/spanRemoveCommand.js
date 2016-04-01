import {
  RemoveCommand
}
from './commandTemplate'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(annotationData, selectionModel, id) {
  var removeSpan = new RemoveCommand(annotationData, selectionModel, 'span', id),
    removeEntity = _.flatten(annotationData.span.get(id).getTypes().map(function(type) {
      return type.entities.map(function(entityId) {
        return entityAndAssociatesRemoveCommand(annotationData, selectionModel, entityId)
      })
    })),
    subCommands = removeEntity.concat(removeSpan)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'remove', id, subCommands)
    }
  }
}
