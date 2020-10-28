import updateGridPosition from './updateGridPosition'

// Management position of annotation components.
export default class {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  arrangePosition(textBox, gridRectangle) {
    for (const span of this._annotationData.span.allDenotationSpans) {
      // The span may be remeved because this functon is call asynchronously.
      if (!this._annotationData.span.get(span.id)) {
        continue
      }

      const { top, left } = gridRectangle.getRectangle(textBox, span)
      updateGridPosition(span, top, left)
    }
  }
}
