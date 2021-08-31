import bindContextMenu from './bindContextMenu'

export default function (editor, controlBar, contextMenu) {
  // add control bar
  editor[0].insertBefore(controlBar.el, editor[0].childNodes[0])
  // add context menu
  editor[0].appendChild(contextMenu.el)

  bindContextMenu(editor, contextMenu)

  // Although there are two event sources, there is only one event consumer,
  // so only one event handler can be bound to an event.
  editor.eventEmitter.on('textae-event.control.button.click', (event) =>
    editor.api.handleButtonClick(event)
  )

  editor.api.updateButtons()
}
