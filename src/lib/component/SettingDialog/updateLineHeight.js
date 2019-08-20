import getLineHeight from '../../editor/start/View/lineHeight/getLineHeight'
import jQuerySugar from '../jQuerySugar'

export default function(editor, $dialog) {
  return jQuerySugar.setValue($dialog, '.line-height', getLineHeight(editor[0]))
}
