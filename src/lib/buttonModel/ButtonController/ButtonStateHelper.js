const allButtons = ['delete'],
  spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste']),
  relationButtons = allButtons.concat(['change-label', 'negation', 'speculation']),
  entityButtons = relationButtons.concat(['copy'])

export default function(selectionModel, modeAccordingToButton, buttonEnableStates, buttonTransitStates, updateModificationButtons) {
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
      buttonEnableStates.updateButtons(spanButtons)
      propagate()
    },
    updateByEntity() {
      buttonEnableStates.updateButtons(entityButtons)
      updateModificationButtons(selectionModel.entity)
      propagate()
    },
    updateByRelation() {
      buttonEnableStates.updateButtons(relationButtons)
      updateModificationButtons(selectionModel.relation)
      propagate()
    }
  }
}
