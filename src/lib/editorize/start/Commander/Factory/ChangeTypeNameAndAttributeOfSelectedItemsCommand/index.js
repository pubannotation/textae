import CompositeCommand from '../CompositeCommand'
import ChangeAnnotationCommand from '../ChangeAnnotationCommand'
import getChangeAttributeCommands from './getChangeAttributeCommands'
import getAddPatternToStringAttributeDefinitionCommand from '../getAddPatternToStringAttributeDefinitionCommand'

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
      (item) => !item.typeValues.isSameType(typeName, attributes)
    )

    // Change type of items.
    this._subCommands = itemsWithChange.map(
      (item) =>
        new ChangeAnnotationCommand(
          annotationData,
          annotationType,
          item.id,
          typeName
        )
    )

    // Change attributes
    this._subCommands = this._subCommands.concat(
      getChangeAttributeCommands(itemsWithChange, attributes, annotationData)
    )

    for (const { pred, obj, label } of attributes) {
      const definitionContainer = annotationData.typeDefinition.attribute
      const attrDef = definitionContainer.get(pred)
      const commnad = getAddPatternToStringAttributeDefinitionCommand(
        definitionContainer,
        attrDef,
        obj,
        label
      )
      if (commnad) {
        this._subCommands.push(commnad)
      }
    }

    this._logMessage = `set type ${typeName}${
      attributes.length > 0
        ? ` and attributes ${JSON.stringify(attributes)}`
        : ``
    } to ${annotationType} items ${itemsWithChange.map((i) => i.id)}`
  }
}
