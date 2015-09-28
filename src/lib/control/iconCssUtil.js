import toButtonClass from './toButtonClass'

// Utility functions to change appearance of bunttons.
export function enable($control, buttonType) {
  find($control, buttonType)
      .removeClass('textae-control__icon--disabled')
}

export function disable($control, buttonType) {
  find($control, buttonType)
      .addClass('textae-control__icon--disabled')
}

export function push($control, buttonType) {
  find($control, buttonType)
      .addClass('textae-control__icon--pushed')
}

export function unpush($control, buttonType) {
  find($control, buttonType)
      .removeClass('textae-control__icon--pushed')
}

function find($control, buttonType) {
  return $control
      .find(toButtonClass(buttonType))
}
