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
      const functionName = target
        .closest('.textae-editor__setting-dialog__function-availability-name')
        .textContent.trim()

      if (target.checked) {
        functionAvailability.enable(functionName)
        eventEmitter.emit('textae-event.configuration.reset')
      } else {
        functionAvailability.disable(functionName)
        eventEmitter.emit('textae-event.configuration.reset')
      }
    })
  )
}
