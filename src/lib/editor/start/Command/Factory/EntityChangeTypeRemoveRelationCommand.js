import { RemoveCommand } from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    id,
    newType,
    isBlockType
  ) {
    super()
    const changeType = new ChangeTypeCommand(
      editor,
      annotationData,
      'entity',
      id,
      newType
    )

    // Block types do not have relations. If there is a relation, delete it.
    this.subCommands = isBlockType
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
    this._logMessage = `set ${newType} to type of the entity ${id}`
    this.id = id
  }
}
