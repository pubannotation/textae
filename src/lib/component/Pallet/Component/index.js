import createPalletElement from './createPalletElement'
import bindEventHandlers from './bindEventHandlers'

export default function(editor, command, autocompletionWs, elementEditor) {
  const pallet = createPalletElement()

  bindEventHandlers(pallet, elementEditor, editor, autocompletionWs, command)

  return pallet
}
