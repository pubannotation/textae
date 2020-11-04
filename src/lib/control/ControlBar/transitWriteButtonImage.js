export default function (el, isTransit) {
  const button = el.querySelector('.textae-control__write-button')

  if (isTransit === true) {
    button.classList.add(`textae-control__write-button--transit`)
  } else {
    button.classList.remove(`textae-control__write-button--transit`)
  }
}
