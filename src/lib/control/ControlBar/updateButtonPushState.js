export default function (el, buttonType, isPushed) {
  const button = el.querySelector(`.textae-control-${buttonType}-button`)

  // Touch devices limit the number of buttons displayed in the context menu
  // due to the limited screen area.
  if (!button) {
    return
  }

  if (isPushed) {
    button.classList.add('textae-control-icon--pushed')
  } else {
    button.classList.remove('textae-control-icon--pushed')
  }
}
