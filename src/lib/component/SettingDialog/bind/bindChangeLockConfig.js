import delgate from 'delegate'
import debounce300 from './debounce300'

export default function(content, typeDefinition) {
  delgate(
    content,
    '.lock-config',
    'change',
    debounce300((e) => {
      if (e.target.checked) {
        typeDefinition.lockEdit()
      } else {
        typeDefinition.unlockEdit()
      }
    })
  )
}
