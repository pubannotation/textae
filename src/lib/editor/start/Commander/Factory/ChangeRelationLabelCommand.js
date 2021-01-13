import CompositeCommand from './CompositeCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import ChangeTypeDefinitionCommand from './ChangeTypeDefinitionCommand'
import ChangeTypeOfSelectedRelationsCommand from './ChangeTypeOfSelectedRelationsCommand'

export default class ChangeRelationLabelCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    label,
    value,
    typeContainer
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

    const changeRelationCommand = new ChangeTypeOfSelectedRelationsCommand(
      editor,
      annotationData,
      selectionModel,
      value
    )
    if (!changeRelationCommand.isEmpty) {
      commands.push(changeRelationCommand)
    }

    this._subCommands = commands
    this._logMessage = `change relation value: ${value} label: ${label} `
  }
}
