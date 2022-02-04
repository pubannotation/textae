import forwardMethods from './Presenter/forwardMethods'

export default class EditorAPI {
  /**
   * @param {import('./Presenter').default} presenter
   * @param {import('./View').default} view
   */
  constructor(presenter, view) {
    this._view = view
    this._presenter = presenter
    this._isActive = false

    forwardMethods(this, () => presenter, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard'
    ])
  }

  get isActive() {
    return this._isActive
  }

  drawGridsInSight() {
    this._view.drawGridsInSight()
  }

  relayout() {
    this._view.relayout()
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
      this._presenter.applyTextSelection()
    }
  }
}
