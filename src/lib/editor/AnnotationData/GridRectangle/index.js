import getCurrentMaxHeight from './getCurrentMaxHeight'

// The value of getBoundingClientRect may contain 13 decimal places.
// It's too fine to use as a style attribute,
// so I'll round it to 2 decimal places,
// which is below the rounding accuracy of Google Chrome and Firefox.
export default class GridRectangle {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  get maxHeight() {
    return getCurrentMaxHeight(this._annotationData)
  }
}
