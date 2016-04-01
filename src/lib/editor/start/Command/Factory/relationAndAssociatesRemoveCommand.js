import {
  RemoveCommand
}
from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'

export default function(model, id) {
  const removeRelation = new RemoveCommand(model.annotationData, model.selectionModel, 'relation', id),
    removeModification = model.annotationData.getModificationOf(id)
    .map((modification) => modification.id)
    .map((id) => new RemoveCommand(model.annotationData, model.selectionModel, 'modification', id)),
    subCommands = removeModification.concat(removeRelation)

  return {
    execute: function() {
      executeCompositCommand('relation', this, 'remove', id, subCommands)
    }
  }
}
