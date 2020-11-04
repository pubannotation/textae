import updateGridPosition from './updateGridPosition'

// Management position of annotation components.
export default function (annotationData, gridRectangle) {
  for (const span of annotationData.span.allDenotationSpans) {
    // The span may be remeved because this functon is call asynchronously.
    if (!annotationData.span.get(span.id)) {
      continue
    }

    const { top, left } = gridRectangle.denotationGridRectangle(span)
    updateGridPosition(span, top, left)
  }
}
