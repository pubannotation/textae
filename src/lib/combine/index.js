import HelpDialog from '../component/HelpDialog'
import ControlButtonHandler from './ControlButtonHandler'
import bindControlBar from './bindControlBar'
import bindContextMenu from './bindContextMenu'

export default function(editor, controlBar, contextMenu) {
  const helpDialog = new HelpDialog()
  const handleControlButtonClick = new ControlButtonHandler(editor, helpDialog)

  bindControlBar(editor, controlBar)
  bindContextMenu(editor, contextMenu)

  // Although there are two event sources, there is only one event consumer,
  // so only one event handler can be bound to an event.
  editor.eventEmitter.on('textae.control.button.click', (event) =>
    handleControlButtonClick(event)
  )

  editor.api.updateButtons()
}
