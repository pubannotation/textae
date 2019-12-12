import enable from './enable'
import disable from './disable'

export default function(el, buttonType, isEnable) {
  // Set apearance and eventHandler to button.
  if (isEnable === true) {
    enable(el, buttonType)
  } else {
    disable(el, buttonType)
  }
}
