import stickInParent from './stickInParent'

export default function (editor, controlBar) {
  // add control bar
  editor[0].insertBefore(controlBar.el, editor[0].childNodes[0])

  // Stick the control bar in the editor.
  stickInParent(controlBar.el)

  editor.eventEmitter
    .on('textae.control.button.push', (data) =>
      controlBar.updateButtonPushState(data.buttonName, data.state)
    )
    .on('textae.control.buttons.change', (enableButtons) =>
      controlBar.updateAllButtonEnableState(enableButtons)
    )
    .on('textae.control.writeButton.transit', (isTrasit) =>
      controlBar.transitWriteButtonImage(isTrasit)
    )
}
