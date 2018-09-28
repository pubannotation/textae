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
    .on('textae.key.input', function() {
      if (contextMenu.isOpen()) {
        contextMenu.closing = true
        contextMenu.hide()
      }
    })

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

  editor[0].addEventListener('mouseup', (e) => {
    if (contextMenu.isOpen()) {
      contextMenu.closing = true
      // Events of a hidden element will not fire, but 'mousedown' event fires before 'contextmenu' event.
      // So change process order by using setTimeout().
      setTimeout(() => contextMenu.hide(), 1)
    }
  })
  editor[0].addEventListener('contextmenu', (e) => {
    // Prevent show browser default context menu
    e.preventDefault()
    contextMenu.show(event.layerY, event.layerX)

    // If 'contextmenu' event fired when context menu has already opened, need to cancel closing.
    if (contextMenu.closing) {
      contextMenu.closing = false
    }
  })
}
