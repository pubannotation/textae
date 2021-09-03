export default function (editor) {
  // Although there are two event sources, there is only one event consumer,
  // so only one event handler can be bound to an event.
  editor.eventEmitter.on('textae-event.control.button.click', (event) =>
    editor.api.handleButtonClick(event)
  )

  editor.api.updateButtons()
}
