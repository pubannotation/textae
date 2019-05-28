module.exports = function(editor, controlBar, handleControlButtonClick) {
  // add control bar
  editor[0].insertBefore(controlBar[0], editor[0].childNodes[0])
  editor.eventEmitter
    .on('textae.control.button.push', (data) => controlBar.updateButtonPushState(data.buttonName, data.state))
    .on('textae.control.buttons.change', (enableButtons) => controlBar.updateAllButtonEnableState(enableButtons))
    .on('textae.control.buttons.transit', (transitButtons) => controlBar.transitButtonImage(transitButtons))

  // Use arguments later than first.
  // Because the first argmest of event handlers of the jQuery event is jQuery event object.
  controlBar
    .on('textae.control.button.click', (e, ...rest) => handleControlButtonClick(...rest))

  controlBar[0].addEventListener('mousedown', (e) => {
    e.preventDefault()
  })
}
