export default function(command, selectionModel) {
  const entities = selectionModel.entity.all()
  const commands = entities.map((entityId) => {
    return command.factory.attributeCreateCommand({
      id: null,
      subj: entityId,
      pred: 'some_predicate',
      obj: 'some_value'
    })
  })

  command.invoke(commands)
}
