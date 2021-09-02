export default function changeCursor(editor, action) {
  editor[0].classList[action]('textae-editor--wait')

  // jQuery Ui dialogs are not in the editor.
  for (const dialog of document.querySelectorAll('.ui-dialog')) {
    dialog.classList[action]('textae-editor--wait')
  }

  for (const dialog of document.querySelectorAll('.ui-widget-overlay')) {
    dialog.classList[action]('textae-editor--wait')
  }
}
