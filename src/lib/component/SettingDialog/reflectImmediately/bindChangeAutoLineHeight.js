import delgate from 'delegate'
import debounce300 from './debounce300'

export default function bindChangeAutoLineHeight(
  content,
  menuState,
  configuration
) {
  delgate(
    content,
    '.textae-editor__setting-dialog__auto-line-height-text',
    'change',
    debounce300(({ target }) => {
      if (target.checked) {
        configuration.autolineheight = true
        menuState.push('auto adjust lineheight')
      } else {
        configuration.autolineheight = false
        menuState.release('auto adjust lineheight')
      }
    })
  )
}
