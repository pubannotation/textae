import find from './find'

export default function($control, buttonType) {
  find($control, buttonType).addClass(
    `textae-control__${buttonType}-button--transit`
  )
}
