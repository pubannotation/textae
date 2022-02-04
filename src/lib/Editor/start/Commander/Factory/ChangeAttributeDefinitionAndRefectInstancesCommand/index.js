import CompositeCommand from '../CompositeCommand'
import ChangeAttributeDefinitionCommand from './ChangeAttributeDefinitionCommand'
import ChangeAttributeCommand from '../ChangeAttributeCommand'

export default class ChangeAttributeDefinitionAndRefectInstancesCommand extends CompositeCommand {
  constructor(
    eventEmitter,
    annotationData,
    definitionContainer,
    attrDef,
    changedProperties
  ) {
    super()

    // change config
    const changeConfigcommands = [
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
        annotationData.attribute.getSameDefinitionsAttributes(attrDef.pred)

      changAnnotationCommands = sameDefinitionAttributes.map((attribute) => {
        return new ChangeAttributeCommand(
          annotationData,
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

    this._subCommands = changeConfigcommands.concat(changAnnotationCommands)
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to attribute definition ${attrDef.pred}`
  }
}
