import CompositeCommand from './CompositeCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import ChangeTypeDefinitionCommand from './ChangeTypeDefinitionCommand'
import ChangeTypeNameAndAttributeRemoveRelationOfSelectedEntitiesCommand from './ChangeTypeNameAndAttributeRemoveRelationOfSelectedEntitiesCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    label,
    value,
    attributes,
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
            'entity',
            value,
            new Map([['label', label]])
          )
        )
      }
    }

    const changeEntityCommand = new ChangeTypeNameAndAttributeRemoveRelationOfSelectedEntitiesCommand(
      editor,
      annotationData,
      selectionModel,
      value,
      attributes
    )
    if (!changeEntityCommand.isEmpty) {
      commands.push(changeEntityCommand)
    }

    this._subCommands = commands
    this._logMessage = `change entity value: ${value} attribute: ${JSON.stringify(
      attributes
    )}  label: ${label} `
  }
}
