import find from '../../find'

export default function(el, buttonType) {
  find(el, buttonType).classList.remove(
    `textae-control__${buttonType}-button--transit`
  )
}
