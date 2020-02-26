import invoke from './invoke'
import invokeRevert from './invokeRevert'
import Factory from './Factory'

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
export default function(
  editor,
  annotationData,
  selectionModel,
  history,
  typeeDefinition
) {
  return {
    invoke: (command) => {
      if (command.isEmpty) {
        return
      }

      invoke([command])
      history.push([command])
    },
    undo: () => {
      if (history.hasAnythingToUndo) {
        // Focus the editor.
        // Focus is lost when undo a creation.
        selectionModel.clear()
        editor.focus()
        invokeRevert(history.prev().commands)
      }
    },
    redo: () => {
      if (history.hasAnythingToRedo) {
        // Select only new element when redo a creation.
        selectionModel.clear()

        invoke(history.next().commands)
      }
    },
    factory: new Factory(
      editor,
      annotationData,
      selectionModel,
      typeeDefinition
    )
  }
}
