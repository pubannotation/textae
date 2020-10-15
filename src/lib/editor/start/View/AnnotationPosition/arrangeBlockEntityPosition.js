import updateGridPosition from './updateGridPosition'

// Management position of annotation components.
export default function(annotationData, textBox, gridRectangle) {
  for (const span of annotationData.span.allBlockSpans) {
    // The span may be remeved because this functon is call asynchronously.
    if (!annotationData.span.get(span.id)) {
      return
    }

    const { top, left } = gridRectangle.blockGridRectangle(textBox, span)
    updateGridPosition(span, top, left)
  }
}
