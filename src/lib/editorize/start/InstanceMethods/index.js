import IconEventMap from './IconEventMap'

export default class InstanceMethods {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    buttonController,
    view
  ) {
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

  handleButtonClick(key) {
    if (this._iconEventMap.has(key)) {
      this._iconEventMap.get(key)()
    }
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
