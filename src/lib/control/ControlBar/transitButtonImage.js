export default function(el, transitButtons) {
  for (const button of el.querySelectorAll('.textae-control__icon')) {
    const buttonType = button.dataset.buttonType

    if (transitButtons[buttonType] === true) {
      button.classList.add(`textae-control__${buttonType}-button--transit`)
    } else {
      button.classList.remove(`textae-control__${buttonType}-button--transit`)
    }
  }
}
