import delgate from 'delegate'
import debounce300 from './debounce300'

export default function bindChangeAutoSave(content, menuState, configuration) {
  delgate(
    content,
    '.textae-editor__setting-dialog__auto-save-text',
    'change',
    debounce300(({ target }) => {
      if (target.checked) {
        configuration.autosave = true
        menuState.push('upload automatically')
      } else {
        configuration.autosave = false
        menuState.release('upload automatically')
      }
    })
  )
}
