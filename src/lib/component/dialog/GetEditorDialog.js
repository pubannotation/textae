var EditorDialog = require('./EditorDialog'),
  FunctionUseCache = require('./FunctionUseCache')

// Cache instances per editor.
module.exports = function(editor) {
  editor.getDialog = editor.getDialog || new FunctionUseCache(_.partial(EditorDialog, editor.editorId))
  return editor.getDialog
}
