import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'

export default class ChangeTypeOfSelectedEntitiesCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newTypeName) {
    super()

    // Get only entities with changes.
    const entitiesWithChange = selectionModel.entity.all
      .filter((entity) => !entity.isSameType(newTypeName))
      .map((entity) => entity.id)

    // Change type of entities.
    this._subCommands = entitiesWithChange.map(
      (id) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          'entity',
          id,
          newTypeName
        )
    )

    this._logMessage = `set type ${newTypeName} to entities ${entitiesWithChange}`
  }
}
