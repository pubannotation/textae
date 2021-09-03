export default function (el, buttonType, isPushed) {
  const button = el.querySelector(`.textae-control-${buttonType}-button`)

  if (isPushed) {
    button.classList.add('textae-control-icon--pushed')
  } else {
    button.classList.remove('textae-control-icon--pushed')
  }
}
