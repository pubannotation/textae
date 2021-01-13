import CompositeCommand from '../CompositeCommand'
import ChangeAnnotationCommand from '../ChangeAnnotationCommand'
import getChangeAttributeCommands from './getChangeAttributeCommands'

export default class ChangeTypeNameAndAttributeOfSelectedEntitiesCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeName, attributes) {
    super()

    const annotationType = 'entity'

    // Get only entities with changes.
    const entitiesWithChange = selectionModel[annotationType].all.filter(
      (e) => !e.isSameType(typeName, attributes)
    )

    // Change type of entities.
    const changeTypeCommands = entitiesWithChange.map(
      (e) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          annotationType,
          e.id,
          typeName
        )
    )

    // Change attributes
    const changeAttributeCommnads = getChangeAttributeCommands(
      entitiesWithChange,
      attributes,
      annotationData,
      editor,
      selectionModel
    )

    this._subCommands = changeTypeCommands.concat(changeAttributeCommnads)
    this._logMessage = `set type ${typeName} and ${JSON.stringify(
      attributes
    )} to ${annotationType} items ${entitiesWithChange}`
  }
}
