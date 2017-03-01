import KeyInputHandler from './KeyInputHandler'
import HelpDialog from '../../component/HelpDialog'
import $ from 'jquery'

const helpDialog = new HelpDialog(),
  noop = () => {}

// Observe key-input events and convert events to readable code.
export default function(editors) {
  const keyInputHandler = new KeyInputHandler(helpDialog, editors)

  let onKeyup = keyInputHandler // Overwrite by the noop when daialogs are opened.

  editors.observeKeyInput(onKeyup)

  // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
  $('body')
    .on('dialogopen', '.textae-editor--dialog', () => onKeyup = noop)
    .on('dialogclose', '.textae-editor--dialog', () => onKeyup = keyInputHandler)
}
