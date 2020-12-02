import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getCurrentMaxHeight from './getCurrentMaxHeight'
import round from './round'

// The value of getBoundingClientRect may contain 13 decimal places.
// It's too fine to use as a style attribute,
// so I'll round it to 2 decimal places,
// which is below the rounding accuracy of Google Chrome and Firefox.
export default class GridRectangle {
  constructor(annotationData, displayInstance) {
    this._annotationData = annotationData
    this._displayInstance = displayInstance
  }

  get maxHeight() {
    return getCurrentMaxHeight(
      this._annotationData,
      this._displayInstance.typeGap
    )
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
            this._displayInstance.typeGap,
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
      top: round(parseInt(span.backgroundElement.style.top)),
      left: round(rectOfTextBox.width - 108)
    }
  }
}
