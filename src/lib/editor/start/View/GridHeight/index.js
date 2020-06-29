import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getCurrentMaxHeight from './getCurrentMaxHeight'

export default class TextBox {
  constructor(annotationData, typeGap) {
    this._annotationData = annotationData
    this._typeGap = typeGap
  }

  get currentMaxHeight() {
    return getCurrentMaxHeight(this._annotationData, this._typeGap)
  }

  getHeightIncludeDescendantGrids(span) {
    return getHeightIncludeDescendantGrids(
      span,
      this._typeGap(),
      this._annotationData
    )
  }
}
