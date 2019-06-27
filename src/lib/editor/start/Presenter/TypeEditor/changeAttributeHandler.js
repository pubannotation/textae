import EditAttributeDialog from '../../../../component/EditAttributeDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, selectionModel, editAttributeHandler, autocompletionWs) {
  if (editAttributeHandler.getSelectedIdEditable().length > 0) {
    const handler = editAttributeHandler,
      value1 = handler.getSelectedPred(),
      value2 = handler.getSelectedValue(),
      done = (pred, value, label) => {
        let commands = []

        if (label) {
          const command = editAttributeHandler.changeLabelOfId(value, label)

          if (command) {
            commands.push(command)
          }
        }

        if (value) {
          commands = commands.concat(editAttributeHandler.changeSelectedElement(pred, value))
          editAttributeHandler.command.invoke(commands, ['annotation'])
        }

        // Cancel selections here.
        // Because attributes are selected only during processing click events of add, edit and delete buttons.
        selectionModel.clear()
      }

    let dialog = new EditAttributeDialog(editor, editAttributeHandler.typeContainer, done, autocompletionWs)
    dialog.update(value1, value2)
    dialog.open()
  }
}
