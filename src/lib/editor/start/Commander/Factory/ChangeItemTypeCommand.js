import CompositeCommand from './CompositeCommand'
import ChangeTypeNameAndAttributeOfSelectedItemsCommand from './ChangeTypeNameAndAttributeOfSelectedItemsCommand'
import createChangeConfigCommand from './createChangeConfigCommand'

export default class ChangeItemTypeCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    label,
    value,
    definitionContainer,
    attributes
  ) {
    super()

    const commands = []
    if (label) {
      commands.push(
        createChangeConfigCommand(
          definitionContainer,
          value,
          editor,
          annotationData,
          new Map([['label', label]])
        )
      )
    }

    const changeInstanceCommand = new ChangeTypeNameAndAttributeOfSelectedItemsCommand(
      editor,
      annotationData,
      selectionModel,
      definitionContainer.annotationType,
      value,
      attributes
    )
    if (!changeInstanceCommand.isEmpty) {
      commands.push(changeInstanceCommand)
    }

    this._subCommands = commands
    this._logMessage = `change ${
      definitionContainer.annotationType
    } value:"${value}"${label ? `, label:"${label}"` : ``}${
      attributes.length > 0 ? `, attributes:${JSON.stringify(attributes)}` : ``
    }`
  }
}
