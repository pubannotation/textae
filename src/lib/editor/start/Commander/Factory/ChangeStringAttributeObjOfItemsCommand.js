import CompositeCommand from './CompositeCommand'
import ChangeAttributeCommand from './ChangeAttributeCommand'
import getAddValueToAttributeDefinitionCommand from './getAddValueToAttributeDefinitionCommand'

export default class ChangeStringAttributeObjOfItemsCommand extends CompositeCommand {
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
      const attribute = item.attributes.find(
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

    const addValueForLabelToStirngAttributeDefinitionCommands = []
    if (newLabel) {
      const commnad = getAddValueToAttributeDefinitionCommand(
        definitionContainer,
        attrDef,
        newObj,
        newLabel
      )
      if (commnad) {
        addValueForLabelToStirngAttributeDefinitionCommands.push(commnad)
      }
    }

    this._subCommands = this._subCommands.concat(
      addValueForLabelToStirngAttributeDefinitionCommands
    )
    this._logMessage = `update obj ${newObj} to attributes: ${effectedAttributes
      .map((attribute) => attribute.id)
      .join(',')}`
  }
}
