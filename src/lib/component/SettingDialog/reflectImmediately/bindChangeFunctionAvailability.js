import delegate from 'delegate'
import debounce300 from './debounce300'

export default function bindChangeFunctionAvailability(
  content,
  eventEmitter,
  functionAvailability
) {
  delegate(
    content,
    '.textae-editor__setting-dialog__function-availability-checkbox',
    'change',
    debounce300(({ target }) => {
      const functionName = target.closest('label').textContent.trim()
      const isChecked = target.checked

      if (isChecked) {
        functionAvailability.enable(functionName)
        eventEmitter.emit('textae-event.configuration.reset')
      } else {
        functionAvailability.disable(functionName)
        eventEmitter.on('textae-event.configuration.reset')
      }
    })
  )
}
