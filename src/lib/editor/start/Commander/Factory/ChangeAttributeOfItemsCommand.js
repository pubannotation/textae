import CompositeCommand from './CompositeCommand'
import ChangeAttributeCommand from './ChangeAttributeCommand'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'

export default class ChangeAttributeOfItemsCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    definitionContainer,
    items,
    attrDef,
    newObj,
    newLabel = null
  ) {
    super()

    const effectedAttributes = []
    for (const item of items) {
      const attribute = item.typeValues.attributes.find(
        (a) => a.pred == attrDef.pred && a.obj !== newObj
      )

      if (attribute) {
        effectedAttributes.push(attribute)
      }
    }

    this._subCommands = effectedAttributes.map(
      (attribute) =>
        new ChangeAttributeCommand(annotationData, attribute, null, newObj)
    )

    if (effectedAttributes.length) {
      this._afterInvoke = () =>
        editor.eventEmitter.emit(
          'textae-event.commander.attributes.change',
          effectedAttributes
        )
    }

    // When the value of the string attribute is acquired by auto-complete,
    // if the label of the acquired value is not registered in the attribute definition pattern,
    // it will be additionally registered.
    const addValueForLabelToStirngAttributeDefinitionCommands = []
    if (
      newLabel &&
      attrDef.valueType === 'string' &&
      !attrDef.values.some((v) => v.pattern === newObj)
    ) {
      addValueForLabelToStirngAttributeDefinitionCommands.push(
        new AddValueToAttributeDefinitionCommand(definitionContainer, attrDef, {
          pattern: newObj,
          label: newLabel
        })
      )
    }

    this._subCommands = this._subCommands.concat(
      addValueForLabelToStirngAttributeDefinitionCommands
    )
    this._logMessage = `update obj ${newObj} to attributes: ${effectedAttributes
      .map((attribute) => attribute.id)
      .join(',')}`
  }
}
