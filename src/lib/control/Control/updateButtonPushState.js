export default function (el, buttonType, isPushed) {
  const button = el.querySelector(`.textae-control__${buttonType}-button`)

  if (isPushed) {
    button.classList.add('textae-control__icon--pushed')
  } else {
    button.classList.remove('textae-control__icon--pushed')
  }
}
