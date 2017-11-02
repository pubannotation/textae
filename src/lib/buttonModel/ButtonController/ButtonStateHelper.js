const allButtons = ['delete'],
  spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste']),
  relationButtons = allButtons.concat(['pallet', 'change-label', 'negation', 'speculation']),
  entityButtons = relationButtons.concat(['copy'])

export default function(selectionModel, modeAccordingToButton, buttonEnableStates, updateButtonState, buttonTransitStates, updateModificationButtons) {
  const propagate = () => {
      buttonEnableStates.propagate()
      buttonTransitStates.propagate()
      modeAccordingToButton.propagate()
    }

  return {
    propagate,
    enabled(button, enable) {
      buttonEnableStates.set(button, enable)
      propagate()
    },
    transit(button, isTransit) {
      buttonTransitStates.set(button, isTransit)
      propagate()
    },
    updateBySpan() {
      updateButtonState(spanButtons)
      propagate()
    },
    updateByEntity() {
      updateButtonState(entityButtons)
      updateModificationButtons(selectionModel.entity)
      propagate()
    },
    updateByRelation() {
      updateButtonState(relationButtons)
      updateModificationButtons(selectionModel.relation)
      propagate()
    }
  }
}
