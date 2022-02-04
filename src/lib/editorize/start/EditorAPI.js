import forwardMethods from './forwardMethods'

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
      'pasteEntitiesFromSystemClipboard',
      'isActive',
      'active',
      'deactive',
      'applyTextSelection'
    ])
  }

  drawGridsInSight() {
    this._annotationData.drawGridsInSight()
  }

  relayout() {
    this._annotationData.textBox.forceUpdate()
    this._annotationData.updatePosition()
  }
}
