import { RemoveCommand } from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, annotationData, selectionModel, id) {
  const removeRelation = new RemoveCommand(
      editor,
      annotationData,
      selectionModel,
      'relation',
      id
    ),
    removeModification = annotationData
      .getModificationOf(id)
      .map((modification) => modification.id)
      .map(
        (id) =>
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'modification',
            id
          )
      ),
    subCommands = removeModification.concat(removeRelation)

  return {
    execute: function() {
      executeCompositCommand('relation', this, 'remove', id, subCommands)
    }
  }
}
