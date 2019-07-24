import { TYPE_CLASS } from './const'

export default function(selectionModel, spanId) {
  const grid = document.querySelector(`#G${spanId}`)

  // Block span has no grid.
  if (grid) {
    const type = grid.querySelector(`.${TYPE_CLASS}`)
    selectionModel.selectEntityLabel(type)
  }
}
