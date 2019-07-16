export default function setButtonState(buttonController, editable, mode) {
  buttonController.modeAccordingToButton.getButton('view').value(isView(editable))
  buttonController.modeAccordingToButton.getButton('term').value(isTerm(editable, mode))
  buttonController.modeAccordingToButton.getButton('relation').value(isRelation(mode))
  buttonController.modeAccordingToButton.getButton('simple').value(isSimple(mode))
  buttonController.buttonStateHelper.enabled('simple', !isRelation(mode))
  buttonController.buttonStateHelper.enabled('replicate-auto', isSpanEdit(editable, mode))
  buttonController.buttonStateHelper.enabled('boundary-detection', isSpanEdit(editable, mode))
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
