import { RemoveCommand } from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(
  editor,
  annotationData,
  selectionModel,
  id,
  newType,
  isBlockType
) {
  const changeType = new ChangeTypeCommand(
    editor,
    annotationData,
    'entity',
    id,
    newType
  )
  // Block types do not have relations. If there is a relation, delete it.
  const subCommands = isBlockType
    ? annotationData.entity
        .assosicatedRelations(id)
        .map(
          (id) =>
            new RemoveCommand(
              editor,
              annotationData,
              selectionModel,
              'relation',
              id
            )
        )
        .concat(changeType)
    : [changeType]

  return {
    execute() {
      executeCompositCommand('entity', this, 'change', id, subCommands)
    }
  }
}
