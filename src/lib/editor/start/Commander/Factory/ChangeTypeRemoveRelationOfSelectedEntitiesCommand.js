import CompositeCommand from './CompositeCommand'
import ChangeTypeCommand from './ChangeTypeCommand'
import getRemoveRelationCommands from './getRemoveRelationCommands'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newType, typeContainer) {
    super()

    // Get only entities with changes.
    const entitiesWithChange = selectionModel.entity
      .all()
      .filter(
        (entityId) => annotationData.entity.get(entityId).type.name !== newType
      )

    // Change type of entities.
    const changeTypeCommands = entitiesWithChange.map(
      (id) =>
        new ChangeTypeCommand(editor, annotationData, 'entity', id, newType)
    )

    // Block types do not have relations. If there is a relation, delete it.
    const removeRelationCommands = typeContainer.isBlock(newType)
      ? getRemoveRelationCommands(
          entitiesWithChange,
          annotationData,
          editor,
          selectionModel
        )
      : []

    this._subCommands = removeRelationCommands.concat(changeTypeCommands)
    this._logMessage = `set type ${newType} to entities ${entitiesWithChange}`
  }
}
