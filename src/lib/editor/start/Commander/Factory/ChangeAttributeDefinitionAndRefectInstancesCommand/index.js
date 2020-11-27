import CompositeCommand from '../CompositeCommand'
import createChangeAnnotationCommands from './createChangeAnnotationCommands'
import ChangeAttributeDefinitionCommand from './ChangeAttributeDefinitionCommand'

export default class ChangeAttributeDefinitionAndRefectInstancesCommand extends CompositeCommand {
  constructor(annotationData, typeContainer, attrDef, changedProperties) {
    super()

    // change config
    const changeConfigcommands = [
      new ChangeAttributeDefinitionCommand(
        typeContainer,
        attrDef,
        changedProperties
      )
    ]

    let changAnnotationCommands = []
    // change annotation
    if (changedProperties.has('pred')) {
      changAnnotationCommands = createChangeAnnotationCommands(
        annotationData,
        attrDef.pred,
        changedProperties.get('pred')
      )
    }

    this._subCommands = changeConfigcommands.concat(changAnnotationCommands)
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to attribute definition ${attrDef.pred}`
  }
}
