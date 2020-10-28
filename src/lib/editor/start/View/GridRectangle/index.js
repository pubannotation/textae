import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getCurrentMaxHeight from './getCurrentMaxHeight'
import getGridRect from './getGridRect'
import round from './round'

export default class GridRectangle {
  constructor(annotationData, typeGap) {
    this._annotationData = annotationData
    this._typeGap = typeGap
  }

  get maxHeight() {
    return getCurrentMaxHeight(this._annotationData, this._typeGap)
  }

  // The value of getBoundingClientRect may contain 13 decimal places.
  // It's too fine to use as a style attribute,
  // so I'll round it to 2 decimal places,
  // which is below the rounding accuracy of Google Chrome and Firefox.
  getGridRectangle(textBox, span) {
    const { width, top, left } = getGridRect(textBox, span)

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
