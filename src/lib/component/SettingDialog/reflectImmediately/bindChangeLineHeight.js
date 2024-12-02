import delgate from 'delegate'
import debounce300 from './debounce300'
import redrawAllEditor from './redrawAllEditor'

export default function (content, textBox) {
  delgate(
    content,
    '.textae-editor__setting-dialog__line-height-text',
    'change',
    debounce300((e) => {
      textBox.lineHeight = e.target.value
      redrawAllEditor()
    })
  )
}
