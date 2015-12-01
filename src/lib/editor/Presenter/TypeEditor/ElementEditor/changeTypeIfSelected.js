export default function(command, getSelectedFunction, model, createChangeTypeCommandFunction, newType) {
  const commands = getSelectedFunction()
    .filter((id) => model.get(id).type !== newType)
    .map((id) => createChangeTypeCommandFunction(id, newType))

  command.invoke(commands)
}
