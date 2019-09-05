import delgate from 'delegate'
import debounce300 from './debounce300'
import updateLineHeight from '../updateLineHeight'

export default function(content, editorDom, displayInstance) {
  delgate(
    content,
    '.type-gap',
    'change',
    debounce300((e) => {
      displayInstance.changeTypeGap(Number(e.target.value))
      updateLineHeight(editorDom, content)
    })
  )
}
