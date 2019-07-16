const allButtons = ['delete']
const spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste'])
const relationButtons = allButtons.concat(['change-label', 'negation', 'speculation'])
const entityButtons = relationButtons.concat(['copy'])

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
