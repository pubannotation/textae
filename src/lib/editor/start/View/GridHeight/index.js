import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getCurrentMaxHeight from './getCurrentMaxHeight'
import getGridRect from './getGridRect'
import round from './round'

export default class GridHeight {
  constructor(annotationData, typeGap) {
    this._annotationData = annotationData
    this._typeGap = typeGap
  }

  get currentMaxHeight() {
    return getCurrentMaxHeight(this._annotationData, this._typeGap)
  }

  // The value of getBoundingClientRect may contain 13 decimal places.
  // It's too fine to use as a style attribute,
  // so I'll round it to 2 decimal places,
  // which is below the rounding accuracy of Google Chrome and Firefox.
  getGridRectOf(span) {
    const { width, top, left } = getGridRect(span)

    return {
      width: round(width),
      top: round(
        top -
          getHeightIncludeDescendantGrids(
            span,
            this._typeGap(),
            this._annotationData
          )
      ),
      left: round(left)
    }
  }
}
