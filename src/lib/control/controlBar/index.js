import BUTTON_MAP from '../buttonMap'
import toButtonList from '../toButtonList'
import createElement from './createElement'
import updateAllButtonEnableState from '../updateAllButtonEnableState'
import updateButtonPushState from '../updateButtonPushState'
import transitButtonImage from './transitButtonImage'
import bindEventHandler from '../bindEventHandler'

// The control is a control bar in an editor.
export default function(eventEmitter) {
  const el = createElement()
  bindEventHandler(el, eventEmitter)

  const buttonList = toButtonList(BUTTON_MAP)

  // Public API
  const api = {
    el,
    updateAllButtonEnableState: (enableButtons) =>
      updateAllButtonEnableState(el, buttonList, enableButtons),
    updateButtonPushState: (buttonType, isPushed) =>
      updateButtonPushState(el, buttonType, isPushed),
    transitButtonImage: (transitButtons) =>
      transitButtonImage(el, buttonList, transitButtons)
  }

  return api
}
