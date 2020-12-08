import delgate from 'delegate'
import debounce300 from './debounce300'

export default function (content, entityGap, textBox) {
  delgate(
    content,
    '.type-gap',
    'change',
    debounce300((e) => {
      entityGap.value = Number(e.target.value)
      content.querySelector('.line-height').value = textBox.lineHeight
    })
  )
}
