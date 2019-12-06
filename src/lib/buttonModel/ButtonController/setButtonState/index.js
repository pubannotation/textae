import isView from './isView'
import isTerm from './isTerm'
import isRelation from './isRelation'
import isSimple from './isSimple'
import isSpanEdit from './isSpanEdit'

export default function(buttonController, editable, mode) {
  buttonController.pushButtons.getButton('view').value(isView(editable))
  buttonController.pushButtons.getButton('term').value(isTerm(editable, mode))
  buttonController.pushButtons.getButton('relation').value(isRelation(mode))
  buttonController.pushButtons.getButton('simple').value(isSimple(mode))
  buttonController.buttonStateHelper.enabled('simple', !isRelation(mode))
  buttonController.buttonStateHelper.enabled(
    'replicate-auto',
    isSpanEdit(editable, mode)
  )
  buttonController.buttonStateHelper.enabled(
    'boundary-detection',
    isSpanEdit(editable, mode)
  )
  buttonController.buttonStateHelper.enabled('line-height', editable)
  buttonController.buttonStateHelper.enabled('pallet', !isView(editable))
}
