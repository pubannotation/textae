import debounce300 from './debounce300'
import updateLineHeight from '../updateLineHeight'

export default function($content, editor, displayInstance) {
  const onTypeGapChange = debounce300((e) => {
    displayInstance.changeTypeGap(Number(e.target.value))
    updateLineHeight(editor, $content)
  })

  return $content.on('change', '.type-gap', onTypeGapChange)
}
