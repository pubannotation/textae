import bindControlBar from './bindControlBar'
import bindContextMenu from './bindContextMenu'

export default function (editor, controlBar, contextMenu) {
  bindControlBar(editor, controlBar)
  bindContextMenu(editor, contextMenu)

  // Although there are two event sources, there is only one event consumer,
  // so only one event handler can be bound to an event.
  editor.eventEmitter.on('textae-event.control.button.click', (event) =>
    editor.api.handleButtonClick(event)
  )

  editor.api.updateButtons()
}
