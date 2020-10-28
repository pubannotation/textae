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
  getRectangle(textBox, span) {
    console.assert(span.element, 'span is not renderd')
    const spanElement = span.element

    // An element.offsetTop and element.offsetLeft does not work in the Firefox,
    // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
    const rectOfSpan = spanElement.getBoundingClientRect()
    const rectOfTextBox = textBox.boundingClientRect

    return {
      width: round(spanElement.offsetWidth),
      top: round(
        rectOfSpan.top -
          rectOfTextBox.top -
          getHeightIncludeDescendantGrids(
            span,
            this._typeGap(),
            this._annotationData
          )
      ),
      left: round(rectOfSpan.left - rectOfTextBox.left)
    }
  }
}
