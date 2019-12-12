export default function(el, eventEmitter) {
  // Bind eventhandler
  const eventHandler = (e) => {
    // Ignore disabled button's events.
    if (e.currentTarget.classList.contains('textae-control__icon--disabled')) {
      return
    }
    // Trigger events with buttonType
    const buttonType = e.currentTarget.dataset.buttonType
    eventEmitter.emit(
      'textae.control.button.click',
      `textae.control.button.${buttonType.replace(/-/g, '_')}.click`
    )
  }
  for (const button of el.querySelectorAll('.textae-control__icon')) {
    button.addEventListener('click', eventHandler)
  }
}
