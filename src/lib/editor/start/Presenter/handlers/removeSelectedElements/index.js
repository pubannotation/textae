import RemoveCommandsFromSelection from './RemoveCommandsFromSelection'

export default function(command, selectionModel, selectHandler) {
  let selectNext = selectHandler.selectRightFunc(),
    commands = new RemoveCommandsFromSelection(command, selectionModel)

  command.invoke(commands)
  selectNext()
}
