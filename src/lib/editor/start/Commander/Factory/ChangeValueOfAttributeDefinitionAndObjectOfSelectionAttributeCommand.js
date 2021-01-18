import CompositeCommand from './CompositeCommand'
import ChangeObjectOfAttributeCommand from './ChangeObjectOfAttributeCommand'
import ChangeValueOfAttributeDefinitionCommand from './ChangeValueOfAttributeDefinitionCommand'

export default class ChangeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand extends CompositeCommand {
  constructor(
    annotationData,
    typeContainer,
    attrDef,
    index,
    value,
    indexThatRemoveDefaultFrom
  ) {
    super()

    this._subCommands = [
      new ChangeValueOfAttributeDefinitionCommand(
        typeContainer,
        attrDef,
        index,
        value,
        indexThatRemoveDefaultFrom
      )
    ]

    if (
      attrDef['value type'] === 'selection' &&
      attrDef.values[index].id !== value.id
    ) {
      this._subCommands.push(
        new ChangeObjectOfAttributeCommand(
          annotationData,
          attrDef.pred,
          attrDef.values[index].id,
          value.id
        )
      )
    }

    this._logMessage = `change attribute definition.`
  }
}
