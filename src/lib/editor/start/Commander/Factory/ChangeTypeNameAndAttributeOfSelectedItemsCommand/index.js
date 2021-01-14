import CompositeCommand from '../CompositeCommand'
import ChangeAnnotationCommand from '../ChangeAnnotationCommand'
import getChangeAttributeCommands from './getChangeAttributeCommands'

export default class ChangeTypeNameAndAttributeOfSelectedItemsCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    annotationType,
    typeName,
    attributes
  ) {
    super()

    // Get only items with changes.
    const itemsWithChange = selectionModel[annotationType].all.filter(
      (item) => !item.isSameType(typeName, attributes)
    )

    // Change type of items.
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
