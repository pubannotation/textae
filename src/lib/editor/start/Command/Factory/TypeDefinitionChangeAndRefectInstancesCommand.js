import CompositeCommand from './CompositeCommand'
import ChangeTypeCommand from './ChangeTypeCommand'
import TypeDefinitionChangeCommand from './TypeDefinitionChangeCommand'

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

    // change config
    const subComands = [
      new TypeDefinitionChangeCommand(
        editor,
        annotationData,
        typeDefinition,
        modelType,
        id,
        changedProperties,
        revertDefaultTypeId
      )
    ]

    // change annotation
    if (
      changedProperties.has('id') ||
      changedProperties.has('label') ||
      changedProperties.has('color')
    ) {
      annotationData[modelType].all().map((model) => {
        if (model.type === id) {
          subComands.push(
            new ChangeTypeCommand(
              editor,
              annotationData,
              modelType,
              model.id,
              changedProperties.get('id') || id
            )
          )
        }
      })
    }

    this.subCommands = subComands
    this.id = id
  }

  execute() {
    super.execute('type definition', 'change', this.id, this.subCommands)
  }
}
