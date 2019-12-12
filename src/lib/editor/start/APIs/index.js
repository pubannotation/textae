import handle from './handle'
import KeyApiMap from './KeyApiMap'
import IconApiMap from './IconApiMap'
import PalletApiMap from './PalletApiMap'

export default class {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    buttonController,
    view,
    updateLineHeight
  ) {
    this._keyApiMap = new KeyApiMap(commander, presenter, persistenceInterface)
    this._iconApiMap = new IconApiMap(
      commander,
      presenter,
      persistenceInterface,
      buttonController,
      updateLineHeight
    )
    this._palletApiMap = new PalletApiMap(persistenceInterface)
    this._view = view
    this._buttonController = buttonController
  }

  handleKeyInput(key, value) {
    handle(this._keyApiMap, key, value)
  }

  handleButtonClick(key, value) {
    handle(this._iconApiMap, key, value)
  }

  handlePalletClick(key, value) {
    handle(this._palletApiMap, key, value)
  }

  redraw() {
    this._view.updateDisplay()
  }

  // To trigger button state update events on init.
  // Because an inline annotation is readed before a binding the control.
  updateButtons() {
    this._buttonController.buttonStateHelper.propagate()
  }
}
