import EditLabelDialog from '../../../../component/EditLabelDialog'
import {
  EventEmitter as EventEmitter
}
  from 'events'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, getHandler, autocompletionWs) {
  const handler = getHandler(),
    value1 = 'type',
    value2 = '',
    done = (value1, value2) => {
      let commands = [],
        emitter = new EventEmitter()

      if (value2) {
        const command = handler.addType(value2)

        if (command) {
          commands.push(command)
          handler.command.invoke(commands)
          editor.eventEmitter.emit('textae.pallet.update')
        }
      }
    }

  let dialog = new EditLabelDialog(editor, handler.typeContainer, done, autocompletionWs)
  dialog.update(value1, value2)
  dialog.open()
}
