import alertifyjs from 'alertifyjs'
import History from '../../History'
import Factory from './Factory'

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
export default class Commander {
  constructor(
    editorHTMLElement,
    editorID,
    eventEmitter,
    annotationData,
    selectionModel
  ) {
    this._editorHTMLElement = editorHTMLElement
    this._editorID = editorID
    this._eventEmitter = eventEmitter
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._history = new History(eventEmitter)
  }

  invoke(command) {
    if (command.isEmpty) {
      return
    }

    command.execute()
    this._history.push(command)
  }

  undo() {
    if (this._history.hasAnythingToUndo) {
      // Focus the editor.
      // Focus is lost when undo a creation.
      this._selectionModel.removeAll()
      this._editorHTMLElement.focus()

      const command = this._history.prev()
      if (command.kind.has('configuration_command')) {
        alertifyjs.success('configuration has been undone')
      }

      command.revert().execute()
    }
  }

  redo() {
    if (this._history.hasAnythingToRedo) {
      // Select only new element when redo a creation.
      this._selectionModel.removeAll()

      const command = this._history.next()
      if (command.kind.has('configuration_command')) {
        alertifyjs.success('configuration has been redo')
      }

      command.execute()
    }
  }

  get factory() {
    return new Factory(
      this._editorID,
      this._eventEmitter,
      this._annotationData,
      this._selectionModel,
      this._annotationData.typeDefinition
    )
  }
}
