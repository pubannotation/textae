import HelpDialog from '../component/HelpDialog'
import ControlButtonHandler from './ControlButtonHandler'
import bindControlBar from './bindControlBar'
import bindContextMenu from './bindContextMenu'

module.exports = function(editor, controlBar, contextMenu) {
  const helpDialog = new HelpDialog()
  const handleControlButtonClick = new ControlButtonHandler(editor, helpDialog)

  bindControlBar(editor, controlBar, handleControlButtonClick)
  bindContextMenu(editor, contextMenu, handleControlButtonClick)

  editor.api.updateButtons()
}
