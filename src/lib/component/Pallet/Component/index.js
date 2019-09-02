import createPalletElement from './createPalletElement'
import bindEventHandlers from './bindEventHandlers'

export default function(editor, commander, autocompletionWs, elementEditor) {
  const pallet = createPalletElement()

  bindEventHandlers(pallet, elementEditor, editor, autocompletionWs, commander)

  return pallet
}
