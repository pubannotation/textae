import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getCurrentMaxHeight from './getCurrentMaxHeight'
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
  getRectangle(span) {
    console.assert(span.element, 'span is not renderd')
    const { top, left, width } = span.rectangle

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
