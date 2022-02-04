import forwardMethods from './Presenter/forwardMethods'

export default class EditorAPI {
  /**
   * @param {import('./Presenter').default} presenter
   * @param {import('./../AnnotationData').default} annotationData
   */
  constructor(presenter, annotationData) {
    this._annotationData = annotationData
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
    this._annotationData.drawGridsInSight()
  }

  relayout() {
    this._annotationData.textBox.forceUpdate()
    this._annotationData.updatePosition()
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
