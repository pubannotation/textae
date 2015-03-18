export default function(typeEditor) {
    if (typeEditor.getSelectedIdEditable().length > 0) {
        let currentType = typeEditor.getTypeOfSelected();

        var newType = prompt('Please enter a new label', currentType);
        if (newType) {
            typeEditor.changeTypeOfSelected(newType);
        }
    }
}
