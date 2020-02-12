import commandLog from './commandLog'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(editor, typeContainer, removeType, revertDefaultTypeId) {
    super()
    this.editor = editor
    this.typeContainer = typeContainer
    this.removeType = removeType
    this.revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    const id = this.removeType.id
    const oldType = this.typeContainer.get(id)

    this.typeContainer.delete(id)

    if (this.revertDefaultTypeId) {
      this.typeContainer.defaultType = this.revertDefaultTypeId
    }

    if (oldType) {
      this.removeType = oldType
    }

    commandLog(
      `remove a type:${JSON.stringify(this.removeType)}, default is ${
        this.typeContainer.defaultType
      }`
    )
  }

  revert() {
    return new CreateTypeDefinitionCommand(
      this.editor,
      this.typeContainer,
      this.removeType
    )
  }
}
