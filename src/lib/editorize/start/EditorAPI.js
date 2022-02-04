import forwardMethods from './Presenter/forwardMethods'

export default class EditorAPI {
  /**
   * @param {import('./Presenter').default} presenter
   * @param {import('./../AnnotationData').default} annotationData
   */
  constructor(presenter, annotationData) {
    this._annotationData = annotationData
    this._presenter = presenter

    forwardMethods(this, () => presenter, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard'
    ])
  }

  get isActive() {
    return this._presenter.isActive
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
  }

  deactive() {
    this._presenter.deactive()
  }

  applyTextSelection() {
    if (this._isActive) {
      this._presenter.applyTextSelection()
    }
  }
}
