import handleTypeContainerEventListners from './handleTypeContainerEventListners'
import releasePalletUpateFunction from './releasePalletUpateFunction'

export default function(typeContainer, updateDisplayForEditMode) {
  releasePalletUpateFunction(typeContainer, updateDisplayForEditMode)
  // Save the event listener as an object property to delete the event listener when the palette is closed.
  // Update table content when config lock state or type definition changing
  handleTypeContainerEventListners(
    typeContainer,
    'add',
    updateDisplayForEditMode
  )
}
