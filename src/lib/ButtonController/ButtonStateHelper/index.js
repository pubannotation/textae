import propergate from './propergate'

const allButtons = ['delete']
const spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste'])
const relationButtons = allButtons.concat([
  'change-label',
  'negation',
  'speculation'
])
const entityButtons = relationButtons.concat(['copy'])

export default class {
  constructor(
    buttonEnableStates,
    buttonTransitStates,
    pushButtons,
    selectionModel
  ) {
    this.buttonEnableStates = buttonEnableStates
    this.buttonTransitStates = buttonTransitStates
    this.pushButtons = pushButtons
    this._propagate = () => {
      propergate(buttonEnableStates, buttonTransitStates, pushButtons)
    }
    this.selectionModel = selectionModel
  }

  propagate() {
    this._propagate()
  }

  enabled(button, enable) {
    this.buttonEnableStates.set(button, enable)
    this._propagate()
  }

  transit(button, isTransit) {
    this.buttonTransitStates.set(button, isTransit)
    this._propagate()
  }

  updateBySpan() {
    this.buttonEnableStates.updateButtons(spanButtons)
    this._propagate()
  }

  updateByEntity() {
    this.buttonEnableStates.updateButtons(entityButtons)
    this.pushButtons.updateModificationButtons(this.selectionModel.entity)
    this._propagate()
  }

  updateByRelation() {
    this.buttonEnableStates.updateButtons(relationButtons)
    this.pushButtons.updateModificationButtons(this.selectionModel.relation)
    this._propagate()
  }
}
