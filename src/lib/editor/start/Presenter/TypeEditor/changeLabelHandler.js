import EditLabelDialog from '../../../../component/EditLabelDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, getHandler, autocompletionWs) {
  if (getHandler().getSelectedIdEditable().length > 0) {
    const handler = getHandler()
    const predicate = 'type'
    const value = handler.getSelectedType()
    const done = (_, value, label) => {
      const commands = []

      if (label) {
        const command = handler.changeLabelOfId(value, label)

        if (command) {
          commands.push(command)
        }
      }

      if (value) {
        handler.command.invoke(
          commands.concat(handler.changeTypeOfSelectedElement(value))
        )
      }
    }

    const dialog = new EditLabelDialog(
      editor,
      predicate,
      value,
      done,
      handler.typeContainer,
      autocompletionWs
    )
    dialog.open()
  }
}
