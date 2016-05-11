import KeyInputHandler from './KeyInputHandler'
import HelpDialog from '../../component/HelpDialog'

const helpDialog = new HelpDialog(),
  noop = () => {}

// Observe key-input events and convert events to readable code.
export default function(editors) {
  const keyInputHandler = new KeyInputHandler(helpDialog, editors)

  let onKeyup = keyInputHandler // Overwrite by the noop when daialogs are opened.

  editors.observeKeyInput(onKeyup)

  // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
  $('body')
    .on('dialogopen', '.ui-dialog', () => onKeyup = noop)
    .on('dialogclose', '.ui-dialog', () => onKeyup = keyInputHandler)
}
