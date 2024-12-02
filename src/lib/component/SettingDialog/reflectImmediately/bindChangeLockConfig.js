import delgate from 'delegate'
import debounce300 from './debounce300'

export default function (content, typeDictionary) {
  delgate(
    content,
    '.textae-editor__setting-dialog__lock-config-text',
    'change',
    debounce300((e) => {
      if (e.target.checked) {
        typeDictionary.lockEdit()
      } else {
        typeDictionary.unlockEdit()
      }
    })
  )
}
