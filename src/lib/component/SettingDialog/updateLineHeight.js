import * as lineHeight from '../../editor/start/View/lineHeight'
import jQuerySugar from '../jQuerySugar'

export default function(editor, $dialog) {
  return jQuerySugar.setValue(
    $dialog,
    '.line-height',
    lineHeight.get(editor[0])
  )
}
