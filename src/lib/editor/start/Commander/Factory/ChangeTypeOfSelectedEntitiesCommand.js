import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'

export default class ChangeTypeOfSelectedEntitiesCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeName) {
    super()

    // Get only entities with changes.
    const elementsWithChange = selectionModel.entity.all.filter(
      (e) => !e.isSameType(typeName)
    )

    // Change type of entities.
    this._subCommands = elementsWithChange.map(
      (e) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          'entity',
          e.id,
          typeName
        )
    )

    this._logMessage = `set type ${typeName} to entities ${elementsWithChange}`
  }
}
