import CompositeCommand from '../CompositeCommand'
import ChangeAnnotationCommand from '../ChangeAnnotationCommand'
import getChangeAttributeCommands from './getChangeAttributeCommands'
import getAddValueToAttributeDefinitionCommand from '../getAddValueToAttributeDefinitionCommand'

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
      editor
    )

    const addValueForLabelToStirngAttributeDefinitionCommands = []
    for (const { pred, obj, label } of attributes) {
      const definitionContainer = annotationData.typeDefinition.attribute
      const attrDef = definitionContainer.get(pred)
      if (label) {
        const commnad = getAddValueToAttributeDefinitionCommand(
          definitionContainer,
          attrDef,
          obj,
          label
        )
        if (commnad) {
          addValueForLabelToStirngAttributeDefinitionCommands.push(commnad)
        }
      }
    }

    this._subCommands = changeTypeCommands
      .concat(changeAttributeCommnads)
      .concat(addValueForLabelToStirngAttributeDefinitionCommands)
    this._logMessage = `set type ${typeName}${
      attributes.length > 0
        ? ` and attributes ${JSON.stringify(attributes)}`
        : ``
    } to ${annotationType} items ${itemsWithChange.map((i) => i.id)}`
  }
}
