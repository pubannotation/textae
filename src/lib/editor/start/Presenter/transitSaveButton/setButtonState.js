export default function setButtonState(buttonController, editable, mode) {
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

function isView(editable) {
  return !editable
}

function isTerm(editable, mode) {
  return editable && (mode === 'term' || mode === 'instance')
}

function isRelation(mode) {
  return mode === 'relation'
}

function isSimple(mode) {
  return mode === 'term'
}

function isSpanEdit(editable, mode) {
  return editable && mode !== 'relation'
}
