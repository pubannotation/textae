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
    changedProperties,
    revertDefaultTypeId
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
        changedProperties,
        revertDefaultTypeId
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
    this.id = id
  }

  execute() {
    super.execute('type definition', 'change', this.id, this.subCommands)
  }
}
