export default function (editor, isEditable) {
  if (isEditable) {
    editor.classList.add('textae-editor--editable')
  } else {
    editor.classList.remove('textae-editor--editable')
  }
}
