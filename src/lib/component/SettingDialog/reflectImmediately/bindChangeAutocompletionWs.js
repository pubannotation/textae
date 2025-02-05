import delgate from 'delegate'
import debounce300 from './debounce300'

export default function bindChangeAutocompletionWs(content, typeDictionary) {
  delgate(
    content,
    '.textae-editor__setting-dialog__autocompletion_ws-text',
    'change',
    debounce300(({ target }) => {
      typeDictionary.autocompletionWs = target.value
    })
  )
}
