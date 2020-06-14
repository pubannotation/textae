import isView from './isView'
import isTerm from './isTerm'
import isRelation from './isRelation'
import isSimple from './isSimple'

export default function(buttonController, editable, mode) {
  buttonController.pushButtons.getButton('view').value(isView(editable))
  buttonController.pushButtons.getButton('term').value(isTerm(editable, mode))
  buttonController.pushButtons.getButton('relation').value(isRelation(mode))
  buttonController.pushButtons.getButton('simple').value(isSimple(mode))
}
