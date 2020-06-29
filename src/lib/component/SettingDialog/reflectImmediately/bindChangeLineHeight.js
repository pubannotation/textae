import delgate from 'delegate'
import debounce300 from './debounce300'
import redrawAllEditor from './redrawAllEditor'

export default function(content, view, editorDom) {
  delgate(
    content,
    '.line-height',
    'change',
    debounce300((e) => {
      view.setLineHeight(e.target.value)
      redrawAllEditor()
    })
  )
}
