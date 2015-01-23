var RemoveCommandsFromSelection = require('./RemoveCommandsFromSelection');

module.exports = function(command, selectionModel, typeEditor) {
    return {
        newLabel: function() {
            if (selectionModel.entity.some() || selectionModel.relation.some()) {
                var newTypeLabel = prompt("Please enter a new label", "");
                if (newTypeLabel) {
                    typeEditor.setNewType(newTypeLabel);
                }
            }
        },
        removeSelectedElements: function() {
            var commands = new RemoveCommandsFromSelection(command, selectionModel);
            command.invoke(commands);
        }
    };
};
