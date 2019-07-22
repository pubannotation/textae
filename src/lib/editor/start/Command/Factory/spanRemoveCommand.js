import _ from 'underscore'

import {
  RemoveCommand
}
from './commandTemplate'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, annotationData, selectionModel, id) {
  const removeEntity = _.flatten(annotationData.span.get(id).getTypes().map((type) => type.entities.map((entityId) => entityAndAssociatesRemoveCommand(editor, annotationData, selectionModel, entityId))))
  const removeSpan = new RemoveCommand(editor, annotationData, selectionModel, 'span', id)
  const subCommands = removeEntity.concat(removeSpan)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'remove', id, subCommands)
    }
  }
}
