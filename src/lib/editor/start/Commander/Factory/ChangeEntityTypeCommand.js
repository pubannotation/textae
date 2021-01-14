import CompositeCommand from './CompositeCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import ChangeTypeDefinitionCommand from './ChangeTypeDefinitionCommand'
import ChangeTypeNameAndAttributeOfSelectedItemsCommand from './ChangeTypeNameAndAttributeOfSelectedItemsCommand'

export default class ChangeEntityTypeCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    label,
    value,
    typeContainer,
    attributes
  ) {
    super()

    const commands = []
    if (label) {
      const oldType = typeContainer.get(value)
      if (!oldType.id) {
        commands.push(
          new CreateTypeDefinitionCommand(editor, typeContainer, {
            id: value,
            label
          })
        )
      } else if (oldType.label !== label) {
        commands.push(
          new ChangeTypeDefinitionCommand(
            editor,
            annotationData,
            typeContainer,
            value,
            new Map([['label', label]])
          )
        )
      }
    }

    const changeInstanceCommand = new ChangeTypeNameAndAttributeOfSelectedItemsCommand(
      editor,
      annotationData,
      selectionModel,
      typeContainer._annotationType,
      value,
      attributes
    )
    if (!changeInstanceCommand.isEmpty) {
      commands.push(changeInstanceCommand)
    }

    this._subCommands = commands
    this._logMessage = `change ${
      typeContainer._annotationType
    } value:"${value}"${label ? `, label:"${label}"` : ``}${
      attributes.length > 0 ? `, attributes:${JSON.stringify(attributes)}` : ``
    }`
  }
}
