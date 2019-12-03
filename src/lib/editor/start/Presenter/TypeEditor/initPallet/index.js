import bindPalletEvents from './bindPalletEvents'
import handleTypeContainerEventListners from './handleTypeContainerEventListners'

export default function(
  pallet,
  editor,
  autocompletionWs,
  commander,
  history,
  dataAccessObject,
  typeContainer,
  handler
) {
  bindPalletEvents(pallet, handler, autocompletionWs, editor, commander)

  // Bind events to pallet
  // Close pallet when selecting other editor.
  editor.eventEmitter.on('textae.pallet.close', () => pallet.hide())

  // Update save config button when changing history and savigng configuration.
  history.on('change', () => pallet.updateDisplay())

  dataAccessObject.on('configuration.save', () => pallet.updateDisplay())

  handleTypeContainerEventListners(typeContainer, 'add', () =>
    pallet.updateDisplay()
  )

  editor[0].appendChild(pallet.el)
}
