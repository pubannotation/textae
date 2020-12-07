// Management position of annotation components.
export default function (spanContainer, textBox, gridRectangle) {
  for (const span of spanContainer.allBlockSpans) {
    // The span may be remeved because this functon is call asynchronously.
    if (!spanContainer.get(span.id)) {
      return
    }

    const { top, left } = span.gridRectangle
    span.updateGridPosition(top, left)
  }
}
