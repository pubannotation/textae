import Pallet from '../../../../../component/Pallet'
import bindPalletEvents from './bindPalletEvents'
import handleTypeContainerEventListners from './handleTypeContainerEventListners'

export default function(
  editor,
  originalData,
  typeDefinition,
  autocompletionWs,
  commander,
  history,
  dataAccessObject,
  editModeName,
  typeContainer,
  handler
) {
  const pallet = new Pallet(
    editor,
    originalData,
    typeDefinition,
    editModeName,
    typeContainer
  )

  bindPalletEvents(pallet, handler, autocompletionWs, editor, commander)

  // Bind events to pallet
  // Close pallet when selecting other editor.
  editor.eventEmitter.on('textae.pallet.close', () => {
    pallet.hide()
  })

  // Update save config button when changing history and savigng configuration.
  history.on('change', () => {
    pallet.updateDisplay()
  })

  dataAccessObject.on('configuration.save', () => {
    pallet.updateDisplay()
  })

  handleTypeContainerEventListners(typeContainer, 'add', () =>
    pallet.updateDisplay()
  )

  editor[0].appendChild(pallet.el)

  return pallet
}
