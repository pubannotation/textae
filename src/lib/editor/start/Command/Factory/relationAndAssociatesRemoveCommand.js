import {
  RemoveCommand
}
from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'

export default function(model, id) {
  var relationRemoveCommand = (relation) => new RemoveCommand(model, 'relation', relation),
    modificationRemoveCommand = (modification) => new RemoveCommand(model, 'modification', modification)

  var removeRelation = relationRemoveCommand(id),
    removeModification = model.annotationData.getModificationOf(id)
    .map(function(modification) {
      return modification.id
    })
    .map(function(id) {
      return modificationRemoveCommand(id)
    }),
    subCommands = removeModification.concat(removeRelation)

  return {
    execute: function() {
      executeCompositCommand('relation', this, 'remove', id, subCommands)
    }
  }
}
