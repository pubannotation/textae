import toButtonClass from './toButtonClass'

export default function($control, buttonType) {
  return $control.find(toButtonClass(buttonType))
}
