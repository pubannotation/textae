import BUTTON_MAP from '../buttonMap'
import makeButtons from './makeButtons'
import toButtonList from '../toButtonList'
import * as cssUtil from '../iconCssUtil'
import updateButtons from '../updateButtons'
import $ from 'jquery'

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
    cssUtil.push($control, buttonType)
  } else {
    cssUtil.unpush($control, buttonType)
  }
}

function transitButtonImage($control, buttonList, transitButtons) {
  Object.keys(transitButtons)
    .filter((buttonType) => buttonList[buttonType])
    .forEach((buttonType) => {
      if (transitButtons[buttonType] === true) {
        cssUtil.transit($control, buttonType)
      } else {
        cssUtil.untransit($control, buttonType)
      }
    })
}
