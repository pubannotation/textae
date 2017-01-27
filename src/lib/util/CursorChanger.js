import _ from 'underscore'

var changeCursor = function(editor, action) {
  // Add jQuery Ui dialogs to targets because they are not in the editor.
  editor = editor.add('.ui-dialog, .ui-widget-overlay')
  editor[action + 'Class']('textae-editor--wait')
}

module.exports = function(editor) {
  var wait = _.partial(changeCursor, editor, 'add'),
    endWait = _.partial(changeCursor, editor, 'remove')

  return {
    startWait: wait,
    endWait: endWait,
  }
}
