import _ from 'underscore'

import {
  RemoveCommand
}
from './commandTemplate'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, annotationData, selectionModel, id) {
  var removeSpan = new RemoveCommand(editor, annotationData, selectionModel, 'span', id),
    removeEntity = _.flatten(annotationData.span.get(id).getTypes().map(function(type) {
      return type.entities.map(function(entityId) {
        return entityAndAssociatesRemoveCommand(editor, annotationData, selectionModel, entityId)
      })
    })),
    subCommands = removeEntity.concat(removeSpan)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'remove', id, subCommands)
    }
  }
}
