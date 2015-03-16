export default function(selectionModel, typeEditor) {
    if (selectionModel.entity.some() || selectionModel.relation.some()) {
        var newTypeLabel = prompt("Please enter a new label", "");
        if (newTypeLabel) {
            typeEditor.setNewType(newTypeLabel);
        }
    }
}
