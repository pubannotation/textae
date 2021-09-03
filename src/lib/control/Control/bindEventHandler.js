import delegate from 'delegate'
import HelpDialog from '../../component/HelpDialog'

const helpDialog = new HelpDialog()

export default function (el, editor) {
  // Bind eventhandler
  delegate(el, '.textae-control-icon', 'click', (e) => {
    const { target } = e
    const { buttonType } = e.target.dataset
    switch (target.dataset.buttonType) {
      case 'help':
        helpDialog.open()
        break
      case 'create-span':
      case 'expand-span':
      case 'shrink-span':
        // Monitor the mousedown event to get the currently selected text.
        break
      default:
        // Ignore disabled button's events.
        if (e.target.classList.contains('textae-control-icon--disabled')) {
          return
        }
        editor.api.handleButtonClick(buttonType)
    }
  })

  delegate(el, '.textae-control-icon', 'mousedown', (e) => {
    const { target } = e
    const { buttonType } = e.target.dataset
    switch (target.dataset.buttonType) {
      case 'help':
        break
      case 'create-span':
      case 'expand-span':
      case 'shrink-span':
        // Monitor the mousedown event to get the currently selected text.
        // Ignore disabled button's events.
        if (e.target.classList.contains('textae-control-icon--disabled')) {
          return
        }
        editor.api.handleButtonClick(buttonType)
        break
      default:
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
