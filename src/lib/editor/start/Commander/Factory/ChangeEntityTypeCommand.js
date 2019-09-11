import CompositeCommand from './CompositeCommand'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'
import TypeDefinitionChangeCommand from './TypeDefinitionChangeCommand'
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
      attributes,
      typeContainer.isBlock(value)
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
