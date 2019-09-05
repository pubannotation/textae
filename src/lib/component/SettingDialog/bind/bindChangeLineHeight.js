import delgate from 'delegate'
import debounce300 from './debounce300'
import setLineHeight from '../../../editor/start/View/lineHeight/setLineHeight'
import redrawAllEditor from './redrawAllEditor'

export default function(content, editorDom) {
  delgate(
    content,
    '.line-height',
    'change',
    debounce300((e) => {
      setLineHeight(editorDom, e.target.value)
      redrawAllEditor()
    })
  )
}
