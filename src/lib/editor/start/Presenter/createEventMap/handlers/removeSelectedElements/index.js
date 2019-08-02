import RemoveCommandsFromSelection from './RemoveCommandsFromSelection'

export default function(command, selectionModel, selectHandler) {
  const commands = new RemoveCommandsFromSelection(command, selectionModel)

  // Select the next element before clear selection.
  selectHandler.selectRight()
  command.invoke(commands)
}
