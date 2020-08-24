import CompositeCommand from './CompositeCommand'
import ChangeObjectOfSelectionAttributeCommand from './ChangeObjectOfSelectionAttributeCommand'
import ChangeValueOfAttributeDefinitionCommand from './ChangeValueOfAttributeDefinitionCommand'

export default class extends CompositeCommand {
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
        new ChangeObjectOfSelectionAttributeCommand(
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
