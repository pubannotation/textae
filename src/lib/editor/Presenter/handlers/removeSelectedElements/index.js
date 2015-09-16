import RemoveCommandsFromSelection from './RemoveCommandsFromSelection';

export default function(command, selectionModel) {
    var commands = new RemoveCommandsFromSelection(command, selectionModel);
    command.invoke(commands);
}
