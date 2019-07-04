import createPalletElement from './createPalletElement'
import bindEventHandlers from './bindEventHandlers'

export default function(editor, annotationData, command, typeContainer, autocompletionWs, elementEditor) {
  const pallet = createPalletElement()

  bindEventHandlers(pallet, elementEditor, typeContainer, editor, autocompletionWs, command)

  return pallet
}
