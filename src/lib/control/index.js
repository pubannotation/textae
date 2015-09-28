import BUTTON_MAP from './buttonMap'
import makeButtons from './makeButtons'
import toButtonList from './toButtonList'
import * as cssUtil from './iconCssUtil'
import updateButtons from './updateButtons'

// Buttons that always eanable.
const ALWAYS_ENABLES = {
  read: true,
  help: true
}

// The control is a control bar to edit.
// This can controls mulitple instance of editor.
export default function($control) {
  let buttonList = toButtonList(BUTTON_MAP)

  makeButtons($control, BUTTON_MAP)

  // Public API
  $control.updateAllButtonEnableState = enableButtons => updateAllButtonEnableState(
      $control,
      buttonList,
      enableButtons
  )
  $control.updateButtonPushState = (buttonType, isPushed) => updateButtonPushState(
      $control,
      buttonType,
      isPushed
  )

  return $control
}

function updateAllButtonEnableState($control, buttonList, enableButtons) {
  // Make buttons in a enableButtons enabled, and other buttons in the buttonList disabled.
  let enables = _.extend({}, buttonList, ALWAYS_ENABLES, enableButtons)

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
