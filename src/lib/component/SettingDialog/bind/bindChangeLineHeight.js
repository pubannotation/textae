import debounce300 from './debounce300'
import setLineHeight from '../../../editor/start/View/lineHeight/setLineHeight'
import redrawAllEditor from './redrawAllEditor'

export default function($content, editor) {
  const onLineHeightChange = debounce300((e) => {
    setLineHeight(editor[0], e.target.value)
    redrawAllEditor()
  })

  return $content.on('change', '.line-height', onLineHeightChange)
}
