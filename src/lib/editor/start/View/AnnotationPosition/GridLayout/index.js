import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  arrangePosition(textBox, gridRectangle) {
    for (const span of this._annotationData.span.allDenotationSpans) {
      arrangeGridPosition(this._annotationData, textBox, gridRectangle, span)
    }
  }
}
