import $ from 'jquery'
import BUTTON_MAP from '../buttonMap'
import toButtonList from '../toButtonList'
import createElement from './createElement'
import updateAllButtonEnableState from './updateAllButtonEnableState'
import updateButtonPushState from './updateButtonPushState'
import transitButtonImage from './transitButtonImage'

// The control is a control bar in an editor.
export default function() {
  const $control = $(createElement())
  const buttonList = toButtonList(BUTTON_MAP)

  // Public API
  $control.updateAllButtonEnableState = (enableButtons) =>
    updateAllButtonEnableState($control, buttonList, enableButtons)
  $control.updateButtonPushState = (buttonType, isPushed) =>
    updateButtonPushState($control, buttonType, isPushed)
  $control.transitButtonImage = (transitButtons) =>
    transitButtonImage($control, buttonList, transitButtons)

  return $control
}
