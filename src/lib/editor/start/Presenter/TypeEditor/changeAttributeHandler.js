import EditAttributeDialog from '../../../../component/EditAttributeDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, selectionModel, getHandler, autocompletionWs) {
  if (getHandler().getSelectedIdEditable().length > 0) {
    const handler = getHandler(),
      value1 = handler.getSelectedPred(),
      value2 = handler.getSelectedValue(),
      done = (pred, value, label) => {
        let commands = []

        if (label) {
          const command = getHandler().changeLabelOfId(value, label)

          if (command) {
            commands.push(command)
          }
        }

        if (value) {
          commands = commands.concat(getHandler().changeSelectedElement(pred, value))
          getHandler().command.invoke(commands)
        }

        // Cancel selections here.
        // Because attributes are selected only during processing click events of add, edit and delete buttons.
        selectionModel.clear()
      }

    let dialog = new EditAttributeDialog(editor, getHandler().typeContainer, done, autocompletionWs)
    dialog.update(value1, value2)
    dialog.open()
  }
}
