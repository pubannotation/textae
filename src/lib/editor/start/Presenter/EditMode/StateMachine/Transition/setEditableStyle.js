export default function(editor, isEditable) {
  if (isEditable) {
    editor.addClass('textae-editor--editable')
  } else {
    editor.removeClass('textae-editor--editable')
  }
}
