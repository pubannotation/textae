import CompositeCommand from '../CompositeCommand'
import ChangeAnnotationCommand from '../ChangeAnnotationCommand'
import getChangeAttributeCommands from './getChangeAttributeCommands'

export default class ChangeTypeNameAndAttributeOfSelectedEntitiesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    annotationType,
    typeName,
    attributes
  ) {
    super()

    // Get only entities with changes.
    const itemsWithChange = selectionModel[annotationType].all.filter(
      (item) => !item.isSameType(typeName, attributes)
    )

    // Change type of entities.
    const changeTypeCommands = itemsWithChange.map(
      (item) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          annotationType,
          item.id,
          typeName
        )
    )

    // Change attributes
    const changeAttributeCommnads = getChangeAttributeCommands(
      itemsWithChange,
      attributes,
      annotationData,
      editor,
      selectionModel
    )

    this._subCommands = changeTypeCommands.concat(changeAttributeCommnads)
    this._logMessage = `set type ${typeName}${
      attributes.length > 0
        ? ` and attributes ${JSON.stringify(attributes)}`
        : ``
    } to ${annotationType} items ${itemsWithChange}`
  }
}
