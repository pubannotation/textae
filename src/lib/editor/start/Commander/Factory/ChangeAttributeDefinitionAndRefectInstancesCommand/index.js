import CompositeCommand from '../CompositeCommand'
import ChangeAttributeDefinitionCommand from './ChangeAttributeDefinitionCommand'
import ChangeAttributeCommand from '../ChangeAttributeCommand'

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
      changAnnotationCommands = annotationData.attribute.all
        .filter((attr) => attr.pred === attrDef.pred)
        .map((attribute) => {
          return new ChangeAttributeCommand(
            annotationData,
            attribute,
            changedProperties.get('pred'),
            attribute.obj
          )
        })
    }

    this._subCommands = changeConfigcommands.concat(changAnnotationCommands)
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to attribute definition ${attrDef.pred}`
  }
}
