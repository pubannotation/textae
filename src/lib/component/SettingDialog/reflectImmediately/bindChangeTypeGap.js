import delgate from 'delegate'
import debounce300 from './debounce300'

export default function (content, entityGap, textBox) {
  delgate(
    content,
    '.textae-editor__setting-dialog__type-gap-text',
    'change',
    debounce300((e) => {
      entityGap.value = Number(e.target.value)
      content.querySelector(
        '.textae-editor__setting-dialog__line-height-text'
      ).value = textBox.lineHeight
    })
  )
}
