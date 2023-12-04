import CompositeCommand from '../CompositeCommand'
import ChangeAttributeDefinitionCommand from './ChangeAttributeDefinitionCommand'
import ChangeAttributeCommand from '../ChangeAttributeCommand'

export default class ChangeAttributeDefinitionAndRefectInstancesCommand extends CompositeCommand {
  constructor(
    eventEmitter,
    annotationModel,
    definitionContainer,
    attrDef,
    changedProperties
  ) {
    super()

    // After updating the attribute definition, the value type of the attribute can be retrieved.
    // This is true for both normal and undo executions.
    this._isExecuteSubCommandsInReverseOrderWhenRevert = false

    // change config
    const changeConfigCommands = [
      new ChangeAttributeDefinitionCommand(
        definitionContainer,
        attrDef,
        changedProperties
      )
    ]

    let changAnnotationCommands = []
    // change annotation
    if (changedProperties.has('pred')) {
      const sameDefinitionAttributes =
        annotationModel.attribute.getSameDefinitionsAttributes(attrDef.pred)

      changAnnotationCommands = sameDefinitionAttributes.map((attribute) => {
        return new ChangeAttributeCommand(
          annotationModel,
          attribute,
          changedProperties.get('pred'),
          attribute.obj
        )
      })

      this._afterInvoke = () => {
        eventEmitter.emit(
          'textae-event.commander.attributes.change',
          sameDefinitionAttributes
        )
      }
    }

    this._subCommands = changeConfigCommands.concat(changAnnotationCommands)
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to attribute definition ${attrDef.pred}`
  }
}
