import editIdDialog from '../../../component/editIdDialog'

export default function(editor, typeEditor) {
  if (typeEditor.getSelectedIdEditable().length > 0) {
    const currentType = typeEditor.getTypeOfSelected()

    editIdDialog(editor, currentType, (newType) => {
      if (newType) {
        typeEditor.changeTypeOfSelected(newType)
      }
    })
  }
}
