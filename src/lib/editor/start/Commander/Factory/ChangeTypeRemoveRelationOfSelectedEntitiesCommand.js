import CompositeCommand from './CompositeCommand'
import ChangeTypeCommand from './ChangeTypeCommand'
import getRemoveRelationCommands from './getRemoveRelationCommands'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newTypeName) {
    super()

    // Get only entities with changes.
    const entitiesWithChange = selectionModel.entity.all
      .filter((entity) => entity.typeName !== newTypeName)
      .map((entity) => entity.id)

    // Change type of entities.
    const changeTypeCommands = entitiesWithChange.map(
      (id) =>
        new ChangeTypeCommand(editor, annotationData, 'entity', id, newTypeName)
    )

    // Block types do not have relations. If there is a relation, delete it.
    const removeRelationCommands = annotationData.entity.isBlock(newTypeName)
      ? getRemoveRelationCommands(
          entitiesWithChange,
          annotationData,
          editor,
          selectionModel
        )
      : []

    this._subCommands = removeRelationCommands.concat(changeTypeCommands)
    this._logMessage = `set type ${newTypeName} to entities ${entitiesWithChange}`
  }
}
