import debounce300 from './debounce300'
import * as lineHeight from '../../../editor/start/View/lineHeight'
import redrawAllEditor from './redrawAllEditor'

export default function($content, editor) {
  const onLineHeightChange = debounce300((e) => {
    lineHeight.set(editor[0], e.target.value)
    redrawAllEditor()
  })

  return $content.on('change', '.line-height', onLineHeightChange)
}
