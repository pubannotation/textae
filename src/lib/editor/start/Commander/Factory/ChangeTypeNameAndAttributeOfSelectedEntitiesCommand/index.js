import CompositeCommand from '../CompositeCommand'
import ChangeAnnotationCommand from '../ChangeAnnotationCommand'
import getChangeAttributeCommands from './getChangeAttributeCommands'

export default class ChangeTypeNameAndAttributeOfSelectedEntitiesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    newTypeName,
    newAttributes
  ) {
    super()

    // Get only entities with changes.
    const entitiesWithChange = selectionModel.entity.all.filter(
      (e) => !e._isSameType(newTypeName, newAttributes)
    )

    // Change type of entities.
    const changeTypeCommands = entitiesWithChange.map(
      (e) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          'entity',
          e.id,
          newTypeName
        )
    )

    // Change attributes
    const changeAttributeCommnads = getChangeAttributeCommands(
      entitiesWithChange,
      newAttributes,
      annotationData,
      editor,
      selectionModel
    )

    this._subCommands = changeTypeCommands.concat(changeAttributeCommnads)
    this._logMessage = `set type ${newTypeName} and ${JSON.stringify(
      newAttributes
    )} to entities ${entitiesWithChange}`
  }
}
