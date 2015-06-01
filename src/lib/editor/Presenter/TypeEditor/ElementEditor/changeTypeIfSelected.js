export default function(command, getSelectedAndEditable, createChangeTypeCommandFunction, newType) {
    var ids = getSelectedAndEditable();
    if (ids.length > 0) {
        var commands = ids.map(function(id) {
            return createChangeTypeCommandFunction(id, newType);
        });

        command.invoke(commands);
    }
}
