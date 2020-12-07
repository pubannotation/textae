// Management position of annotation components.
export default function (spanContainer) {
  for (const span of spanContainer.allDenotationSpans) {
    // The span may be remeved because this functon is call asynchronously.
    if (!spanContainer.get(span.id)) {
      continue
    }

    const { top, left } = span.gridRectangle
    span.updateGridPosition(top, left)
  }
}
