import handle from './handle'
import KeyEventMap from './KeyEventMap'
import IconEventMap from './IconEventMap'

export default class InstanceMethods {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    buttonController,
    view
  ) {
    this._keyEventMap = new KeyEventMap(
      commander,
      presenter,
      persistenceInterface
    )
    this._iconEventMap = new IconEventMap(
      commander,
      presenter,
      persistenceInterface,
      view,
      buttonController
    )
    this._view = view
    this._buttonController = buttonController
    this._presenter = presenter
    this._isActive = false
  }

  get isActive() {
    return this._isActive
  }

  handleKeyInput(event) {
    this._keyEventMap.handle(this._isActive, event)
  }

  handleButtonClick(key) {
    handle(this._iconEventMap, key, {})
  }

  redraw() {
    this._view.updateDisplay()
  }

  active() {
    this._presenter.active()
    this._isActive = true
  }

  deactive() {
    this._presenter.deactive()
    this._isActive = false
  }

  applyTextSelection() {
    if (this._isActive) {
      this._buttonController.applyTextSelection()
    }
  }
}
