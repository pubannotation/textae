export default function (editor, controlBar) {
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
