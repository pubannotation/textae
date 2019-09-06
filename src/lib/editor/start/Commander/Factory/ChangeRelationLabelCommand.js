import CompositeCommand from './CompositeCommand'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'
import TypeDefinitionChangeCommand from './TypeDefinitionChangeCommand'
import ChangeTypeOfSelectedRelationsCommand from './ChangeTypeOfSelectedRelationsCommand'

export default class extends CompositeCommand {
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
          new TypeDefinitionCreateCommand(editor, typeContainer, {
            id: value,
            label
          })
        )
      } else if (oldType.label !== label) {
        commands.push(
          new TypeDefinitionChangeCommand(
            editor,
            annotationData,
            typeContainer,
            'relation',
            value,
            new Map([['label', label]])
          )
        )
      }
    }

    this._subCommands = commands.concat([
      new ChangeTypeOfSelectedRelationsCommand(
        editor,
        annotationData,
        selectionModel,
        value
      )
    ])

    this._logMessage = `change relation value: ${value} label: ${label} `
  }
}
