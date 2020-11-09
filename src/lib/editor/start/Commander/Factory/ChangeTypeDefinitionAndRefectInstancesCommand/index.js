import CompositeCommand from '../CompositeCommand'
import createChangeConfigCommand from './createChangeConfigCommand'
import createChangeAnnotationCommands from './createChangeAnnotationCommands'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    typeDefinition,
    modelType,
    id,
    changedProperties
  ) {
    super()

    // change config
    const changeConfigcommands = [
      createChangeConfigCommand(
        typeDefinition,
        id,
        editor,
        annotationData,
        modelType,
        changedProperties
      )
    ]

    let changAnnotationCommands = []
    // change annotation
    if (changedProperties.has('id')) {
      changAnnotationCommands = createChangeAnnotationCommands(
        annotationData,
        modelType,
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
