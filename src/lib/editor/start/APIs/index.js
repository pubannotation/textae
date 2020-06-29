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
    view
  ) {
    this._keyApiMap = new KeyApiMap(commander, presenter, persistenceInterface)
    this._iconApiMap = new IconApiMap(
      commander,
      presenter,
      persistenceInterface,
      view
    )
    this._palletApiMap = new PalletApiMap(persistenceInterface)
    this._view = view
    this._buttonController = buttonController
    this._presenter = presenter
    this._isSelected = false
  }

  handleKeyInput(event) {
    // Keyup events occurs without selected editor, When editor is focused before initializing.
    if (this._isSelected) {
      // The value of the key property when pressing a key while holding down the Shift key depends on the keyboard layout.
      // For example, on a US keyboard, the shift + 1 keystroke is “!”.
      // When shift and number key are pressed, the input value is taken from the keyCode property.
      const key =
        event.shiftKey && 48 <= event.keyCode && event.keyCode <= 57
          ? String.fromCharCode(event.keyCode)
          : event.key

      handle(this._keyApiMap, key, event.shiftKey)
    }
  }

  handleButtonClick(key) {
    handle(this._iconApiMap, key, {})
  }

  handlePalletClick(key) {
    handle(this._palletApiMap, key)
  }

  redraw() {
    this._view.updateDisplay()
  }

  // To trigger button state update events on init.
  // Because an inline annotation is readed before a binding the control.
  updateButtons() {
    this._buttonController.propagate()
  }

  select() {
    this._presenter.event.select()
    this._isSelected = true
  }

  unselect() {
    this._presenter.event.unselect()
    this._isSelected = false
  }
}
