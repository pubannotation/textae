import handleTypeContainerEventListners from './handleTypeContainerEventListners'

export default function(typeContainer, updateDisplayForEditMode) {
  handleTypeContainerEventListners(
    typeContainer,
    'remove',
    updateDisplayForEditMode
  )
}
