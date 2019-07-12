const allButtons = ['delete']
const spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste'])
const relationButtons = allButtons.concat(['change-label', 'negation', 'speculation'])
const entityButtons = relationButtons.concat(['copy', 'attribute'])

export default class {
  constructor(buttonEnableStates, buttonTransitStates, pushButtons, selectionModel) {
    this.buttonEnableStates = buttonEnableStates
    this.buttonTransitStates = buttonTransitStates
    this.pushButtons = pushButtons
    this.selectionModel = selectionModel
  }

  propagate() {
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.pushButtons)
  }

  enabled(button, enable) {
    this.buttonEnableStates.set(button, enable)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.pushButtons)
  }

  transit(button, isTransit) {
    this.buttonTransitStates.set(button, isTransit)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.pushButtons)
  }

  updateBySpan() {
    this.buttonEnableStates.updateButtons(spanButtons)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.pushButtons)
  }

  updateByEntity() {
    this.buttonEnableStates.updateButtons(entityButtons)
    this.pushButtons.updateModificationButtons(this.selectionModel.entity)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.pushButtons)
  }

  updateByRelation() {
    this.buttonEnableStates.updateButtons(relationButtons)
    this.pushButtons.updateModificationButtons(this.selectionModel.relation)
    propergate(this.buttonEnableStates, this.buttonTransitStates, this.pushButtons)
  }
}

function propergate(buttonEnableStates, buttonTransitStates, pushButtons) {
  buttonEnableStates.propagate()
  buttonTransitStates.propagate()
  pushButtons.propagate()
}

