export default function setButtonState(buttonController, editable, mode) {
  buttonController.modeAccordingToButton.view.value(isView(editable))
  buttonController.modeAccordingToButton.term.value(isTerm(editable, mode))
  buttonController.modeAccordingToButton.relation.value(isRelation(mode))
  buttonController.modeAccordingToButton.simple.value(isSimple(mode))
  buttonController.buttonStateHelper.enabled('simple', !isRelation(mode))
  buttonController.buttonStateHelper.enabled('replicate-auto', isSpanEdit(editable, mode))
  buttonController.buttonStateHelper.enabled('boundary-detection', isSpanEdit(editable, mode))
  buttonController.buttonStateHelper.enabled('line-height', editable)
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
