import EditAttributeDialog from '../../../../../component/EditAttributeDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, selectionModel, editAttributeHandler, command) {
  if (editAttributeHandler.getSelectedIdEditable().length > 0) {
    const value1 = editAttributeHandler.getSelectedPred()
    const value2 = editAttributeHandler.getSelectedValue()

    const done = (pred, value) => {
      let commands = []

      if (value) {
        commands = commands.concat(editAttributeHandler.changeSelectedElement(command, pred, value))
        command.invoke(commands, ['annotation'])
      }

      // Cancel selections here.
      // Because attributes are selected only during processing click events of add, edit and delete buttons.
      selectionModel.clear()
    }

    const dialog = new EditAttributeDialog(editor, done)
    dialog.update(value1, value2)
    dialog.open()
  }
}
