import invokeCommand from './invokeCommand'
import Factory from './Factory'
import Commands from '../../History/Commands'

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
export default function(editor, annotationData, selectionModel, history) {
  return {
    invoke: (commands) => {
      const c = new Commands(commands)

      if (c.hasCommands) {
        invokeCommand.invoke(c.commands)
        history.push(c)
      }
    },
    undo: () => {
      if (history.hasAnythingToUndo()) {
        // Focus the editor.
        // Focus is lost when undo a creation.
        selectionModel.clear()
        editor.focus()
        invokeCommand.invokeRevert(history.prev().commands)
      }
    },
    redo: () => {
      if (history.hasAnythingToRedo()) {
        // Select only new element when redo a creation.
        selectionModel.clear()

        invokeCommand.invoke(history.next().commands)
      }
    },
    factory: new Factory(editor, annotationData, selectionModel)
  }
}
