const allButtons = ['delete'],
  spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste']),
  relationButtons = allButtons.concat(['change-label', 'negation', 'speculation']),
  entityButtons = relationButtons.concat(['copy'])

export default function(buttonEnableStates, buttonTransitStates, modeAccordingToButton, selectionModel) {
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
      modeAccordingToButton.updateModificationButtons(selectionModel.entity)
      propagate()
    },
    updateByRelation() {
      buttonEnableStates.updateButtons(relationButtons)
      modeAccordingToButton.updateModificationButtons(selectionModel.relation)
      propagate()
    }
  }
}
