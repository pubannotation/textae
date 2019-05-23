module.exports = function(editor) {
  return {
    startWait: () => changeCursor(editor, 'add'),
    endWait: () => changeCursor(editor, 'remove')
  }
}

function changeCursor(editor, action) {
  // Add jQuery Ui dialogs to targets because they are not in the editor.
  editor = editor.add('.ui-dialog, .ui-widget-overlay')
  editor[`${action}Class`]('textae-editor--wait')
}
