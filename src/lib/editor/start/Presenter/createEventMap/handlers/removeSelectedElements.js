export default function(commander, selectHandler) {
  const commands = commander.factory.removeSelectedComand()

  // Select the next element before clear selection.
  selectHandler.selectRight()

  commander.invoke(commands)
}
