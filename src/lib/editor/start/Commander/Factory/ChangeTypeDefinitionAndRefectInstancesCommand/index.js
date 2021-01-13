import CompositeCommand from '../CompositeCommand'
import createChangeConfigCommand from './createChangeConfigCommand'
import createChangeAnnotationCommands from './createChangeAnnotationCommands'

export default class ChangeTypeDefinitionAndRefectInstancesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    typeContainer,
    annotationType,
    id,
    changedProperties
  ) {
    super()

    // change config
    const changeConfigcommands = [
      createChangeConfigCommand(
        typeContainer,
        id,
        editor,
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
        editor,
        changedProperties.get('id')
      )
    }

    this._subCommands = changeConfigcommands.concat(changAnnotationCommands)
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to type definition ${id}`
  }
}
