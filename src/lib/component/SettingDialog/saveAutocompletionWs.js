import validateConfiguration from './validateConfiguration'

export default function bindChangeAutocompletionWs(content, typeDictionary) {
  const newValue = content.querySelector(
    '.textae-editor__setting-dialog__autocompletion_ws-text'
  ).value

  validateConfiguration({
    autocompletion_ws: newValue
  })

  typeDictionary.autocompletionWs = newValue
}
