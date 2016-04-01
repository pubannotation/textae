import {
  RemoveCommand
}
from './commandTemplate'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(model, id) {
  var removeSpan = new RemoveCommand(model.annotationData, model.selectionModel, 'span', id),
    removeEntity = _.flatten(model.annotationData.span.get(id).getTypes().map(function(type) {
      return type.entities.map(function(entityId) {
        return entityAndAssociatesRemoveCommand(model, entityId)
      })
    })),
    subCommands = removeEntity.concat(removeSpan)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'remove', id, subCommands)
    }
  }
}
