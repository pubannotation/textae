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
    let subCommands = []

    // change config
    subCommands.push(
      createChangeConfigCommand(
        typeDefinition,
        id,
        editor,
        annotationData,
        modelType,
        changedProperties
      )
    )

    // change annotation
    if (
      changedProperties.has('id') ||
      changedProperties.has('label') ||
      changedProperties.has('color')
    ) {
      subCommands = subCommands.concat(
        createChangeAnnotationCommands(
          annotationData,
          modelType,
          id,
          editor,
          changedProperties
        )
      )
    }

    this.subCommands = subCommands
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to type definition ${id}`
  }
}
