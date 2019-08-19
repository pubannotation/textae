import $ from 'jquery'
import BUTTON_MAP from '../buttonMap'
import toButtonList from '../toButtonList'
import updateButtons from '../updateButtons'
import push from '../push'
import unpush from '../unpush'
import transit from '../transit'
import untransit from '../untransit'
import makeButtons from './makeButtons'

// Buttons that always eanable.
const ALWAYS_ENABLES = {
  read: true,
  write: true,
  help: true
}

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

function createElement() {
  const el = document.createElement('div')
  el.classList.add('textae-control')
  el.classList.add('textae-control-bar')
  makeButtons(el, BUTTON_MAP)

  return el
}

function updateAllButtonEnableState($control, buttonList, enableButtons) {
  // Make buttons in a enableButtons enabled, and other buttons in the buttonList disabled.
  const enables = Object.assign({}, buttonList, enableButtons, ALWAYS_ENABLES)

  // A function to enable/disable button.
  updateButtons($control, buttonList, enables)
}

function updateButtonPushState($control, buttonType, isPushed) {
  if (isPushed) {
    push($control, buttonType)
  } else {
    unpush($control, buttonType)
  }
}

function transitButtonImage($control, buttonList, transitButtons) {
  Object.keys(transitButtons)
    .filter((buttonType) => buttonList[buttonType])
    .forEach((buttonType) => {
      if (transitButtons[buttonType] === true) {
        transit($control, buttonType)
      } else {
        untransit($control, buttonType)
      }
    })
}
