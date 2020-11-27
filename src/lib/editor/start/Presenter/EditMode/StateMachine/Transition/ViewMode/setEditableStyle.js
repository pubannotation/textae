export default function (editor, isEditable) {
  if (isEditable) {
    editor[0].classList.add('textae-editor--editable')
  } else {
    editor[0].classList.remove('textae-editor--editable')
  }
}
