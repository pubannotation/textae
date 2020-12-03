import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getCurrentMaxHeight from './getCurrentMaxHeight'
import round from './round'

// The value of getBoundingClientRect may contain 13 decimal places.
// It's too fine to use as a style attribute,
// so I'll round it to 2 decimal places,
// which is below the rounding accuracy of Google Chrome and Firefox.
export default class GridRectangle {
  constructor(annotationData, entityGap) {
    this._annotationData = annotationData
    this._entityGap = entityGap
  }

  get maxHeight() {
    return getCurrentMaxHeight(this._annotationData, this._entityGap.value)
  }

  denotationGridRectangle(span) {
    console.assert(span.element, 'span is not renderd')
    const { top, left, width } = span.rectangle

    return {
      width: round(width),
      top: round(
        top -
          getHeightIncludeDescendantGrids(
            span,
            this._entityGap.value,
            this._annotationData
          )
      ),
      left: round(left)
    }
  }

  blockGridRectangle(textBox, span) {
    console.assert(span.element, 'span is not renderd')
    const rectOfTextBox = textBox.boundingClientRect

    return {
      width: 100,
      top: round(span.getReactOfSidekicksOfBlock(textBox).top),
      left: round(rectOfTextBox.width - 108)
    }
  }
}
