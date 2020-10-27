import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  arrangePosition(textBox, gridHeight) {
    for (const span of this._annotationData.span.allObjectSpans) {
      arrangeGridPosition(this._annotationData, textBox, gridHeight, span)
    }
  }
}
