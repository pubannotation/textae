import toButtonClass from './toButtonClass'

export default function(el, buttonType) {
  return el.querySelector(toButtonClass(buttonType))
}
