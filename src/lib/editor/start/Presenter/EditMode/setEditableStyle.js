export default function(editor, buttonStateHelper, isEditable) {
  if (isEditable) {
    editor.addClass('textae-editor--editable')
  } else {
    editor.removeClass('textae-editor--editable')
  }
}
