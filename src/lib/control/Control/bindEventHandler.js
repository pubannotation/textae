import HelpDialog from '../../component/HelpDialog'

const helpDialog = new HelpDialog()

export default function (el, editor) {
  // Bind eventhandler
  const eventHandler = (e) => {
    // Ignore disabled button's events.
    if (e.currentTarget.classList.contains('textae-control__icon--disabled')) {
      return
    }

    const { buttonType } = e.currentTarget.dataset
    editor.api.handleButtonClick(buttonType)
  }

  for (const button of el.querySelectorAll('.textae-control__icon')) {
    if (button.dataset.buttonType === 'help') {
      button.addEventListener('click', () => helpDialog.open())
    } else {
      button.addEventListener('mousedown', eventHandler)
    }
  }
}
