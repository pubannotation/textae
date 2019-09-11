import EditLabelDialog from '../../../../component/EditLabelDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(getHandler, autocompletionWs) {
  if (getHandler().getSelectedIdEditable().length > 0) {
    const handler = getHandler()
    const predicate = 'type'
    const type = handler.getSelectedType()
    const done = (_, value, label) => {
      const commands = handler.changeLabelCommand(label, value)

      if (value) {
        handler.commander.invoke(commands)
      }
    }

    const dialog = new EditLabelDialog(
      predicate,
      type,
      done,
      handler.typeContainer,
      autocompletionWs
    )
    dialog.open()
  }
}
