export default function cancelSelect(typeEditor, editor) {
  typeEditor.cancelSelect()
  // Foucs the editor for ESC key
  editor.focus()
}
