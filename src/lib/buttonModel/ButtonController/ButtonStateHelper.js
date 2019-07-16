const allButtons = ['delete']
const spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste'])
const relationButtons = allButtons.concat(['change-label', 'negation', 'speculation'])
const entityButtons = relationButtons.concat(['copy'])

export default class {
  constructor(buttonEnableStates, buttonTransitStates, modeAccordingToButton, selectionModel) {
    this.buttonEnableStates = buttonEnableStates
    this.buttonTransitStates = buttonTransitStates
    this.modeAccordingToButton = modeAccordingToButton
    this.selectionModel = selectionModel
  }

  propagate() {
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.modeAccordingToButton)
  }

  enabled(button, enable) {
    this.buttonEnableStates.set(button, enable)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.modeAccordingToButton)
  }

  transit(button, isTransit) {
    this.buttonTransitStates.set(button, isTransit)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.modeAccordingToButton)
  }

  updateBySpan() {
    this.buttonEnableStates.updateButtons(spanButtons)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.modeAccordingToButton)
  }

  updateByEntity() {
    this.buttonEnableStates.updateButtons(entityButtons)
    this.modeAccordingToButton.updateModificationButtons(this.selectionModel.entity)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.modeAccordingToButton)
  }

  updateByRelation() {
    this.buttonEnableStates.updateButtons(relationButtons)
    this.modeAccordingToButton.updateModificationButtons(this.selectionModel.relation)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.modeAccordingToButton)
  }
}

function propergate(buttonEnableStates, buttonTransitStates, modeAccordingToButton) {
  buttonEnableStates.propagate()
  buttonTransitStates.propagate()
  modeAccordingToButton.propagate()
}

