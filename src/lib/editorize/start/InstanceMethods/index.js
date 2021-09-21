export default class InstanceMethods {
  constructor(presenter, buttonController, view) {
    this._view = view
    this._buttonController = buttonController
    this._presenter = presenter
    this._isActive = false
  }

  get isActive() {
    return this._isActive
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
