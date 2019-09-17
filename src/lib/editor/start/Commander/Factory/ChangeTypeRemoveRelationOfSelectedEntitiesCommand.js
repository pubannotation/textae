import CompositeCommand from './CompositeCommand'
import { RemoveCommand } from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    newType,
    isRemoveRelations
  ) {
    super()
    const hasChanges = selectionModel.entity
      .all()
      .filter((id) => annotationData.entity.get(id).type.name !== newType)

    const changeTypeCommands = hasChanges.map(
      (id) =>
        new ChangeTypeCommand(editor, annotationData, 'entity', id, newType)
    )

    // Block types do not have relations. If there is a relation, delete it.
    this._subCommands = isRemoveRelations
      ? hasChanges
          .map((id) =>
            annotationData.entity
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
          )
          .flat()
          .concat(changeTypeCommands)
      : changeTypeCommands

    this._logMessage = `set type ${newType} to entities ${hasChanges}`
  }
}
