import enableButton from './enableButton'
import disableButton from './disableButton'

export default function($control, buttonType, enable) {
  // Set apearance and eventHandler to button.
  if (enable === true) {
    enableButton($control, buttonType)
  } else {
    disableButton($control, buttonType)
  }
}
