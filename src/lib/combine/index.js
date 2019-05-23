import HelpDialog from '../component/HelpDialog'
import ControlButtonHandler from './ControlButtonHandler'

module.exports = function combine(editor, controlBar, contextMenu) {
  // add control bar
  editor[0].insertBefore(controlBar[0], editor[0].childNodes[0])
  editor.eventEmitter
    .on('textae.editor.unselect', controlBar.updateAllButtonEnableState)
    .on('textae.control.button.push', (data) => controlBar.updateButtonPushState(data.buttonName, data.state))
    .on('textae.control.buttons.change', (enableButtons) => controlBar.updateAllButtonEnableState(enableButtons))
    .on('textae.control.buttons.transit', (transitButtons) => controlBar.transitButtonImage(transitButtons))

  // add context menu
  editor[0].appendChild(contextMenu[0])
  editor.eventEmitter
    .on('textae.editor.unselect', contextMenu.updateAllButtonEnableState)
    .on('textae.control.button.push', (data) => contextMenu.updateButtonPushState(data.buttonName, data.state))
    .on('textae.control.buttons.change', (enableButtons) => contextMenu.updateAllButtonEnableState(enableButtons))
    .on('textae.key.input', () => contextMenu.hide())

  editor.api.updateButtons()

  const helpDialog = new HelpDialog(),
    handleControlButtonClick = new ControlButtonHandler(editor, helpDialog)

  // Use arguments later than first.
  // Because the first argmest of event handlers of the jQuery event is jQuery event object.
  controlBar
    .on('textae.control.button.click', (e, ...rest) => handleControlButtonClick(...rest))

  contextMenu.$control
    .on('textae.control.button.click', (e, ...rest) => handleControlButtonClick(...rest))

  controlBar[0].addEventListener('mousedown', (e) => {
    e.preventDefault()
  })

  contextMenu[0].addEventListener('mousedown', (e) => {
    // Should prevent because mousedown events bubble to the editor.
    e.preventDefault()
  })

  // Close ContextMenu when another editor is clicked
  window.addEventListener('click', () => contextMenu.hide())
  window.addEventListener('contextmenu', (e) => {
    // Close ContextMenu when another editor is clicked.
    contextMenu.hide()

    // Open ContextMenu when selected editor is clicked.
    if (e.target.closest('.textae-editor') === editor[0]) {
      // Prevent show browser default context menu
      e.preventDefault()
      contextMenu.show(e.layerY, e.layerX)
    }
  })
}
