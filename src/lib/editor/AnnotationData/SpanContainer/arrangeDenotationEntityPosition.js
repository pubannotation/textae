// Management position of annotation components.
export default function (spanContainer, gridRectangle) {
  for (const span of spanContainer.allDenotationSpans) {
    // The span may be remeved because this functon is call asynchronously.
    if (!spanContainer.get(span.id)) {
      continue
    }

    const { top, left } = gridRectangle.denotationGridRectangle(span)
    span.updateGridPosition(top, left)
  }
}
