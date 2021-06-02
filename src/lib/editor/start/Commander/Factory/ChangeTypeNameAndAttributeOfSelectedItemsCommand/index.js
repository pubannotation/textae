import CompositeCommand from '../CompositeCommand'
import ChangeAnnotationCommand from '../ChangeAnnotationCommand'
import getChangeAttributeCommands from './getChangeAttributeCommands'
import AddValueToAttributeDefinitionCommand from '../AddValueToAttributeDefinitionCommand'

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

    // When the value of the string attribute is acquired by auto-complete,
    // if the label of the acquired value is not registered in the attribute definition pattern,
    // it will be additionally registered.
    const addValueForLabelToStirngAttributeDefinitionCommands = []
    for (const { pred, obj, label } of attributes) {
      const definitionContainer = annotationData.typeDefinition.attribute
      const attrDef = definitionContainer.get(pred)
      if (
        label &&
        attrDef.valueType === 'string' &&
        !attrDef.values.some((v) => v.pattern === obj)
      ) {
        addValueForLabelToStirngAttributeDefinitionCommands.push(
          new AddValueToAttributeDefinitionCommand(
            definitionContainer,
            attrDef,
            {
              pattern: obj,
              label
            }
          )
        )
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
