export default function (el, isTransit) {
  const button = el.querySelector('.textae-control-write-button')

  if (isTransit === true) {
    button.classList.add(`textae-control-write-button--transit`)
  } else {
    button.classList.remove(`textae-control-write-button--transit`)
  }
}
