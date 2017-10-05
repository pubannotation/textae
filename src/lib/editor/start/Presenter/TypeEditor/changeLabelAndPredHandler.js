import editIdAndPredDialog from '../../../../component/editIdAndPredDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, selectionModel, getHandler, autocompletionWs) {
  if (getHandler().getSelectedIdEditable().length > 0) {
    const handler = getHandler(),
      currentType = handler.getSelectedType(),
      currentPred = handler.getSelectedPred(),
      done = (id, pred, label) => {
        let commands = []

        if (label) {
          const command = getHandler().changeLabelOfId(id, label)

          if (command) {
            commands.push(command)
          }
        }

        if (id) {
          commands = commands.concat(getHandler().changeSelectedElement(id, pred))
          getHandler().command.invoke(commands)
        }

        // Cancel selections here.
        // Because attributes are selected only during processing click events of add, edit and delete buttons.
        selectionModel.clear()
      }

    editIdAndPredDialog(editor, currentType, currentPred, getHandler().typeContainer, done, autocompletionWs)
  }
}
