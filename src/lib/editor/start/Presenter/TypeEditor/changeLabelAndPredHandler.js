import editIdAndPredDialog from '../../../../component/editIdAndPredDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, selectionModel, getHandler, autocompletionWs) {
  if (getHandler().getSelectedIdEditable().length > 0) {
    const handler = getHandler(),
      currentPred = handler.getSelectedPred(),
      currentValue = handler.getSelectedValue(),
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

    editIdAndPredDialog(editor, currentPred, currentValue, getHandler().typeContainer, done, autocompletionWs)
  }
}
