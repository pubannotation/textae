import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(annotationData, gridHeight) {
    this._annotationData = annotationData
    this._gridHeight = gridHeight
  }

  arrangePosition() {
    for (const span of this._annotationData.span.allSpansWithGrid) {
      arrangeGridPosition(this._annotationData, this._gridHeight, span)
    }
  }
}
