import EditLabelDialog from '../../../../component/EditLabelDialog'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, getHandler, autocompletionWs) {
  if (getHandler().getSelectedIdEditable().length > 0) {
    const handler = getHandler(),
      value1 = 'type',
      value2 = handler.getSelectedType(),
      done = (value1, value2, label) => {
        let commands = []

        if (label) {
          const command = handler.changeLabelOfId(value2, label)

          if (command) {
            commands.push(command)
          }
        }

        if (value2) {
          commands = commands.concat(handler.changeTypeOfSelectedElement(value2))
          handler.command.invoke(commands, ['annotation'])
        }
      }

    let dialog = new EditLabelDialog(editor, handler.typeContainer, done, autocompletionWs)
    dialog.update(value1, value2)
    dialog.open()
  }
}
