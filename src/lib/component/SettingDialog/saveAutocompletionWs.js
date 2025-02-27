import validateConfiguration from './validateConfiguration'
import alertifyjs from 'alertifyjs'

export default function bindChangeAutocompletionWs(content, typeDictionary) {
  const newValue = content.querySelector(
    '.textae-editor__setting-dialog__autocompletion_ws-text'
  ).value

  const errors = validateConfiguration({
    autocompletion_ws: newValue
  })

  if (errors) {
    alertifyjs.warning(
      'Saved value of Autocompletion_ws is invalid. Please check the format.'
    )
  }

  typeDictionary.autocompletionWs = newValue
}
