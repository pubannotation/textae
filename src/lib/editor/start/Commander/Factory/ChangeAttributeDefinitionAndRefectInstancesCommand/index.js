import CompositeCommand from '../CompositeCommand'
import createChangeConfigCommand from './createChangeConfigCommand'
import createChangeAnnotationCommands from './createChangeAnnotationCommands'

export default class extends CompositeCommand {
  constructor(annotationData, typeContainer, attrDef, changedProperties) {
    super()

    // change config
    const changeConfigcommands = [
      createChangeConfigCommand(attrDef, typeContainer, changedProperties)
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
