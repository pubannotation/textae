import alertifyjs from 'alertifyjs'
import Factory from './Factory'
import History from './History'

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
export default class Commander {
  #editorHTMLElement
  #editorID
  #eventEmitter
  #annotationModel
  #selectionModel
  #history

  constructor(
    editorHTMLElement,
    editorID,
    eventEmitter,
    annotationModel,
    selectionModel
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#editorID = editorID
    this.#eventEmitter = eventEmitter
    this.#annotationModel = annotationModel
    this.#selectionModel = selectionModel
    this.#history = new History(eventEmitter)
  }

  invoke(command) {
    if (command.isEmpty) {
      return
    }

    command.execute()
    this.#history.push(command)
  }

  undo() {
    if (this.#history.hasAnythingToUndo) {
      // Focus the editor.
      // Focus is lost when undo a creation.
      this.#selectionModel.removeAll()
      this.#editorHTMLElement.focus()

      const command = this.#history.prev()
      if (command.kind.has('configuration_command')) {
        alertifyjs.success('configuration has been undone')
      }

      command.revert().execute()
    }
  }

  redo() {
    if (this.#history.hasAnythingToRedo) {
      // Select only new element when redo a creation.
      this.#selectionModel.removeAll()

      const command = this.#history.next()
      if (command.kind.has('configuration_command')) {
        alertifyjs.success('configuration has been redo')
      }

      command.execute()
    }
  }

  get factory() {
    return new Factory(
      this.#editorID,
      this.#eventEmitter,
      this.#annotationModel,
      this.#selectionModel,
      this.#annotationModel.typeDictionary
    )
  }
}
