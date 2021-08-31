export default function (editor, controlBar) {
  // add control bar
  editor[0].insertBefore(controlBar.el, editor[0].childNodes[0])

  editor.eventEmitter
    .on('textae-event.control.button.push', (data) =>
      controlBar.updateButtonPushState(data.buttonName, data.state)
    )
    .on('textae-event.control.buttons.change', (enableButtons) =>
      controlBar.updateAllButtonEnableState(enableButtons)
    )
    .on('textae-event.control.writeButton.transit', (isTrasit) =>
      controlBar.transitWriteButtonImage(isTrasit)
    )
}
