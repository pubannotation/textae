import getCurrentMaxHeight from './getCurrentMaxHeight'

export default class GridRectangle {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  get maxHeight() {
    return getCurrentMaxHeight(this._annotationData.span)
  }
}
