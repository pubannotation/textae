import ChangeAttributeCommand from '../ChangeAttributeCommand'
import CompositeCommand from '../CompositeCommand'
import ChangeValueOfAttributeDefinitionCommand from './ChangeValueOfAttributeDefinitionCommand'

export default class ChangeValueOfAttributeDefinitionAndObjectOfAttributeCommand extends CompositeCommand {
  constructor(
    eventEmitter,
    annotationModel,
    definitionContainer,
    attrDef,
    index,
    value,
    indexThatRemoveDefaultFrom
  ) {
    super()

    this._subCommands = [
      new ChangeValueOfAttributeDefinitionCommand(
        definitionContainer,
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
      const sameAttributes = annotationModel.attribute.getSameAttributes(
        attrDef.pred,
        attrDef.values[index].id
      )
      const changeAnnotationCommands = sameAttributes.map(
        (a) => new ChangeAttributeCommand(annotationModel, a, null, value.id)
      )

      this._subCommands = this._subCommands.concat(changeAnnotationCommands)
      this._afterInvoke = () =>
        eventEmitter.emit(
          'textae-event.commander.attributes.change',
          sameAttributes
        )
    }

    this._logMessage = `attribute: ${attrDef.pred}`
  }
}
