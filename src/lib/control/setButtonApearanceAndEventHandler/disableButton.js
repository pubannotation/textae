import toButtonClass from '../toButtonClass'
import disable from '../disable'

export default function($control, buttonType) {
  $control.off('click', toButtonClass(buttonType))
  disable($control, buttonType)
}
