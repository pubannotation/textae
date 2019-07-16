import UpdateModificationButtons from './UpdateModificationButtons'

const allButtons = ['delete'],
  spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste']),
  relationButtons = allButtons.concat(['change-label', 'negation', 'speculation']),
  entityButtons = relationButtons.concat(['copy'])

export default function(buttonEnableStates, buttonTransitStates, annotationData, modeAccordingToButton, selectionModel) {
  const propagate = () => {
      buttonEnableStates.propagate()
      buttonTransitStates.propagate()
      modeAccordingToButton.propagate()
    }

  // Change push/unpush of buttons of modifications.
  const updateModificationButtons = new UpdateModificationButtons(annotationData, modeAccordingToButton)

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
