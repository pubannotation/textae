import find from './find'

export default function($control, buttonType) {
  find($control, buttonType).removeClass(
    `textae-control__${buttonType}-button--transit`
  )
}
