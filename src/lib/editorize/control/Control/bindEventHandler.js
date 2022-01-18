import delegate from 'delegate'
import HelpDialog from '../../../component/HelpDialog'

const helpDialog = new HelpDialog()

export default function (el, iconEventMap) {
  // Monitor the touchestart event to get the currently selected text.
  // On the iPad, the mousedown event fires after the text is deselected.
  delegate(el, '.textae-control-icon', 'touchstart', ({ target }) => {
    // Ignore disabled button's events.
    if (target.classList.contains('textae-control-icon--disabled')) {
      return
    }

    const { buttonType } = target.dataset
    switch (buttonType) {
      case 'create-span':
      case 'expand-span':
      case 'shrink-span':
        iconEventMap.handle(buttonType)
        break
      default:
    }
  })

  delegate(el, '.textae-control-icon', 'click', ({ target }) => {
    // Ignore disabled button's events.
    if (target.classList.contains('textae-control-icon--disabled')) {
      return
    }

    const { buttonType } = target.dataset
    switch (buttonType) {
      case 'help':
        helpDialog.open()
        break
      case 'create-span':
      case 'expand-span':
      case 'shrink-span':
        // Monitor the mousedown event to get the currently selected text.
        break
      default:
        iconEventMap.handle(buttonType)
    }
  })

  const hamburgerMenuButton = el.querySelector(
    '.textae-control-humburger-menu-button'
  )
  if (hamburgerMenuButton) {
    hamburgerMenuButton.addEventListener('click', (e) =>
      e.target
        .closest('.textae-control')
        .querySelector('.textae-control-details')
        .classList.toggle('textae-control-details--force-show')
    )
  }
}
