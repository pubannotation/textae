import buttonConfig from '../../buttonConfig'
import propergate from './propergate'

export default class {
  constructor(buttonEnableStates, pushButtons, selectionModel) {
    this._buttonEnableStates = buttonEnableStates
    this._pushButtons = pushButtons
    this._propagate = () => {
      propergate(buttonEnableStates, pushButtons)
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

  updateBySpan() {
    this._buttonEnableStates.updateButtons(buttonConfig.spanButtons)
    this._propagate()
  }

  updateByEntity() {
    this._buttonEnableStates.updateButtons(buttonConfig.entityButtons)
    this._pushButtons.updateModificationButtons(this._selectionModel.entity)
    this._propagate()
  }

  updateByRelation() {
    this._buttonEnableStates.updateButtons(buttonConfig.relationButtons)
    this._pushButtons.updateModificationButtons(this._selectionModel.relation)
    this._propagate()
  }
}
