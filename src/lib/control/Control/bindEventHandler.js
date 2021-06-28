import HelpDialog from '../../component/HelpDialog'

const helpDialog = new HelpDialog()

export default function (el, editor) {
  // Bind eventhandler
  const eventHandler = (e) => {
    // Ignore disabled button's events.
    if (e.currentTarget.classList.contains('textae-control-icon--disabled')) {
      return
    }

    const { buttonType } = e.currentTarget.dataset
    editor.api.handleButtonClick(buttonType)
  }

  for (const button of el.querySelectorAll('.textae-control-icon')) {
    switch (button.dataset.buttonType) {
      case 'help':
        button.addEventListener('click', () => helpDialog.open())
        break
      case 'create-span':
      case 'expand-span':
        // Monitor the mousedown event to get the currently selected text.
        button.addEventListener('mousedown', eventHandler)
        break
      default:
        button.addEventListener('click', eventHandler)
    }
  }

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
