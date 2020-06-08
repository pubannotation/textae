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
    this._buttonEnableStates = buttonEnableStates
    this._buttonTransitStates = buttonTransitStates
    this._pushButtons = pushButtons
    this._propagate = () => {
      propergate(buttonEnableStates, buttonTransitStates, pushButtons)
    }
    this._selectionModel = selectionModel
  }

  propagate() {
    this._propagate()
  }

  enabled(button, enable) {
    this._buttonEnableStates.set(button, enable)
    this._propagate()
  }

  transit(button, isTransit) {
    this._buttonTransitStates.set(button, isTransit)
    this._propagate()
  }

  updateBySpan() {
    this._buttonEnableStates.updateButtons(spanButtons)
    this._propagate()
  }

  updateByEntity() {
    this._buttonEnableStates.updateButtons(entityButtons)
    this._pushButtons.updateModificationButtons(this._selectionModel.entity)
    this._propagate()
  }

  updateByRelation() {
    this._buttonEnableStates.updateButtons(relationButtons)
    this._pushButtons.updateModificationButtons(this._selectionModel.relation)
    this._propagate()
  }
}
