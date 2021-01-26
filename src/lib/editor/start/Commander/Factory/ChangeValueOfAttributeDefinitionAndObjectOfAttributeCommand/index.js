import ChangeAttributeCommand from '../ChangeAttributeCommand'
import CompositeCommand from '../CompositeCommand'
import ChangeValueOfAttributeDefinitionCommand from './ChangeValueOfAttributeDefinitionCommand'

export default class ChangeValueOfAttributeDefinitionAndObjectOfAttributeCommand extends CompositeCommand {
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
      const changeAnnotationCommands = annotationData.attribute
        .getSameAttributes(attrDef.pred, attrDef.values[index].id)
        .map(
          (a) => new ChangeAttributeCommand(annotationData, a, null, value.id)
        )

      this._subCommands = this._subCommands.concat(changeAnnotationCommands)
    }

    this._logMessage = `change attribute definition.`
  }
}
