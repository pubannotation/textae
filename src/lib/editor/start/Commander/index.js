import alertifyjs from 'alertifyjs'
import invoke from './invoke'
import invokeRevert from './invokeRevert'
import Factory from './Factory'

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
export default class Commander {
  constructor(editor, annotationData, selectionModel, history, typeDefinition) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._history = history
    this._typeDefinition = typeDefinition
  }

  invoke(command) {
    if (command.isEmpty) {
      return
    }

    invoke([command])
    this._history.push([command])
  }

  undo() {
    if (this._history.hasAnythingToUndo) {
      // Focus the editor.
      // Focus is lost when undo a creation.
      this._selectionModel.clear()
      this._editor.focus()

      const commands = this._history.prev()
      if (commands.kinds.has('configuration_command')) {
        alertifyjs.success('configuration has been undone')
      }

      invokeRevert(commands.commands)
    }
  }

  redo() {
    if (this._history.hasAnythingToRedo) {
      // Select only new element when redo a creation.
      this._selectionModel.clear()

      const commands = this._history.next()
      if (commands.kinds.has('configuration_command')) {
        alertifyjs.success('configuration has been redo')
      }

      invoke(commands.commands)
    }
  }

  get factory() {
    return new Factory(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._typeDefinition
    )
  }
}
