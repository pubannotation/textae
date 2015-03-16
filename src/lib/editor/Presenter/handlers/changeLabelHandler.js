export default function(typeEditor) {
    if (typeEditor.getSelectedIdEditable().length > 0) {
        var newTypeLabel = prompt("Please enter a new label", "");
        if (newTypeLabel) {
            typeEditor.changeTypeOfSelected(newTypeLabel);
        }
    }
}
