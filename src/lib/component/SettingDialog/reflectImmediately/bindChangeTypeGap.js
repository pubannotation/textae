import delgate from 'delegate'
import getLineHeight from '../../../editor/start/View/lineHeight/getLineHeight'
import debounce300 from './debounce300'

export default function(content, editorDom, displayInstance) {
  delgate(
    content,
    '.type-gap',
    'change',
    debounce300((e) => {
      displayInstance.typeGap = Number(e.target.value)
      content.querySelector('.line-height').value = getLineHeight(editorDom)
    })
  )
}
