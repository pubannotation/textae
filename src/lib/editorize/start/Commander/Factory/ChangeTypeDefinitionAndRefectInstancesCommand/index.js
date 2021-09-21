import CompositeCommand from '../CompositeCommand'
import createChangeConfigCommand from '../createChangeConfigCommand'
import createChangeAnnotationCommands from './createChangeAnnotationCommands'

export default class ChangeTypeDefinitionAndRefectInstancesCommand extends CompositeCommand {
  constructor(
    annotationData,
    definitionContainer,
    annotationType,
    id,
    changedProperties
  ) {
    super()

    // change config
    const changeConfigcommands = [
      createChangeConfigCommand(
        definitionContainer,
        id,
        annotationData,
        changedProperties
      )
    ]

    let changAnnotationCommands = []
    // change annotation
    if (changedProperties.has('id')) {
      changAnnotationCommands = createChangeAnnotationCommands(
        annotationData,
        annotationType,
        id,
        changedProperties.get('id')
      )
    }

    this._subCommands = changeConfigcommands.concat(changAnnotationCommands)
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to type definition ${id}`
  }
}
