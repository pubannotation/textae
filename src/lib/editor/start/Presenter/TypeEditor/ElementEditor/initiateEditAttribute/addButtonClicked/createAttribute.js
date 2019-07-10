export default function(command, selectionModel) {
  const entities = selectionModel.entity.all()
  const commands = entities.map((entityId) => {
    return command.factory.attributeCreateCommand({
      id: null,
      subj: entityId,
      pred: 'some_predicate',
      value: 'some_value'
    })
  })

  command.invoke(commands, ['annotation'])

  // Cancel selections here.
  // Because attributes are selected only during processing click events of add, edit and delete buttons.
  selectionModel.clear()
}
