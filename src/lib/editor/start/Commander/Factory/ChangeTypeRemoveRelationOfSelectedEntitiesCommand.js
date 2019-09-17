import CompositeCommand from './CompositeCommand'
import EntityChangeTypeRemoveRelationCommand from './EntityChangeTypeRemoveRelationCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    newType,
    isRemoveRelations
  ) {
    super()
    const selectedElements = selectionModel.entity
      .all()
      .filter((id) => annotationData.entity.get(id).type.name !== newType)

    this._subCommands = selectedElements.map(
      (id) =>
        new EntityChangeTypeRemoveRelationCommand(
          editor,
          annotationData,
          selectionModel,
          id,
          newType,
          isRemoveRelations
        )
    )
    this._logMessage = `set type ${newType} to entities ${selectedElements}`
  }
}
