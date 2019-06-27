import EditLabelDialog from '../../../../component/EditLabelDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, getHandler, autocompletionWs) {
  if (getHandler().getSelectedIdEditable().length > 0) {
    const handler = getHandler(),
      predicate = 'type',
      value = handler.getSelectedType(),
      done = (_, value, label) => {
        let commands = []

        if (label) {
          const command = handler.changeLabelOfId(value, label)

          if (command) {
            commands.push(command)
          }
        }

        if (value) {
          commands = commands.concat(handler.changeTypeOfSelectedElement(value))
          handler.command.invoke(commands, ['annotation'])
        }
      }

    let dialog = new EditLabelDialog(editor, handler.typeContainer, done, autocompletionWs)
    dialog.update(predicate, value)
    dialog.open()
  }
}
