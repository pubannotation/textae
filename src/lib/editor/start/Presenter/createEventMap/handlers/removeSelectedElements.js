export default function(command, selectHandler) {
  const commands = command.factory.removeSelectedComand()

  // Select the next element before clear selection.
  selectHandler.selectRight()

  command.invoke(commands)
}
