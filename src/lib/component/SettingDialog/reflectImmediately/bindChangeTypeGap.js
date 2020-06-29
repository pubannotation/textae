import delgate from 'delegate'
import debounce300 from './debounce300'

export default function(content, displayInstance, view) {
  delgate(
    content,
    '.type-gap',
    'change',
    debounce300((e) => {
      displayInstance.typeGap = Number(e.target.value)
      content.querySelector('.line-height').value = view.getLineHeight()
    })
  )
}
