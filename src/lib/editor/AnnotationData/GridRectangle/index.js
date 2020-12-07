import getCurrentMaxHeight from './getCurrentMaxHeight'

export default class GridRectangle {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  get maxHeight() {
    return this._annotationData.span.currentMaxHeight
  }
}
