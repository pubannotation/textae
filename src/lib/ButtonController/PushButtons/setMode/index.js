import isView from '../../isView'
import isRelation from '../../isRelation'
import isTerm from './isTerm'
import isSimple from './isSimple'

export default function(pushButtons, mode, editable) {
  pushButtons.getButton('view').value(isView(editable))
  pushButtons.getButton('term').value(isTerm(editable, mode))
  pushButtons.getButton('relation').value(isRelation(mode))
  pushButtons.getButton('simple').value(isSimple(mode))
}
