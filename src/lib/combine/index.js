import HelpDialog from '../component/HelpDialog'
import ControlButtonHandler from './ControlButtonHandler'

module.exports = function combine(editor, control) {
  editor[0].insertBefore(control[0], editor[0].childNodes[0])

  editor.eventEmitter
    .on('textae.editor.unselect', control.updateAllButtonEnableState)
    .on('textae.control.button.push', (data) => control.updateButtonPushState(data.buttonName, data.state))
    .on('textae.control.buttons.change', (enableButtons) => control.updateAllButtonEnableState(enableButtons))

  editor.api.updateButtons()

  const helpDialog = new HelpDialog(),
    handleControlButtonClick = new ControlButtonHandler(editor, helpDialog)

  // Use arguments later than first.
  // Because the first argmest of event handlers of the jQuery event is jQuery event object.
  control
    .on('textae.control.button.click', (e, ...rest) => handleControlButtonClick(...rest))

  control[0].addEventListener('mousedown', (e) => {
    e.preventDefault()
  })
}
