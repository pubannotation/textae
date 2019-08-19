import invokeCommand from './invokeCommand'
import Factory from './Factory'

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
export default function(editor, annotationData, selectionModel, history) {
  return {
    invoke: (commands) => {
      if (commands && commands.length > 0) {
        invokeCommand.invoke(commands)
        history.push(commands)
      }
    },
    undo: () => {
      if (history.hasAnythingToUndo) {
        // Focus the editor.
        // Focus is lost when undo a creation.
        selectionModel.clear()
        editor.focus()
        invokeCommand.invokeRevert(history.prev())
      }
    },
    redo: () => {
      if (history.hasAnythingToRedo) {
        // Select only new element when redo a creation.
        selectionModel.clear()

        invokeCommand.invoke(history.next())
      }
    },
    factory: new Factory(editor, annotationData, selectionModel)
  }
}
