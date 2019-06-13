import getRightSpanAndGrid from "./getRightSpanAndGrid"

export default function(editorDom, spanId) {
  let [rightSpan, grid] = getRightSpanAndGrid(editorDom, spanId)

  if (!rightSpan) {
    return null
  }

  if (grid) {
    return grid
  }

// Block spans have no grid.
// Travers the next span if the right span is a block span.
while (rightSpan) {
    [rightSpan, grid] = getRightSpanAndGrid(editorDom, rightSpan.id)
    if (grid) {
      return grid
    }
  }
}
