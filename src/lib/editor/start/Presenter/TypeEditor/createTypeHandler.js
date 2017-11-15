import editIdDialog from '../../../../component/editIdDialog'
import {
  EventEmitter as EventEmitter
}
  from 'events'

// An handler is get on runtime, because it is changed by the edit mode.
export default function(editor, getHandler, autocompletionWs) {
  const currentType = '',
    done = (id) => {
      let commands = [],
        emitter = new EventEmitter()

      if (id) {
        const command = getHandler().addType(id)

        if (command) {
          commands.push(command)
          getHandler().command.invoke(commands)
          editor.eventEmitter.emit('textae.pallet.update')
        }
      }
    }

  editIdDialog(editor, currentType, getHandler().typeContainer, done, autocompletionWs)
}
