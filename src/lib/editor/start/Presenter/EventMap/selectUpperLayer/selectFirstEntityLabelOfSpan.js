export default function(selectionModel, spanId) {
  const grid = document.querySelector(`#G${spanId}`)

  // Block span has no grid.
  if (grid) {
    const type = grid.querySelector('.textae-editor__type')
    selectionModel.selectEntityLabel(type)
  }
}
