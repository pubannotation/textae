import CompositeCommand from './CompositeCommand'
import ChangeTypeCommand from './ChangeTypeCommand'
import TypeDefinitionChangeCommand from './TypeDefinitionChangeCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    typeDefinition,
    modelType,
    oldType,
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
        oldType,
        changedProperties,
        revertDefaultTypeId
      )
    ]

    // change annotation
    if (
      changedProperties.id ||
      changedProperties.label ||
      changedProperties.color
    ) {
      annotationData[modelType].all().map((model) => {
        if (model.type === oldType.id) {
          subComands.push(
            new ChangeTypeCommand(
              editor,
              annotationData,
              modelType,
              model.id,
              changedProperties.id || oldType.id
            )
          )
        }
      })
    }

    this.subCommands = subComands
    this.id = oldType.id
  }

  execute() {
    super.execute('type definition', 'change', this.id, this.subCommands)
  }
}
