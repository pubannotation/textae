import {TYPE_CLASS, LABEL_CLASS} from "./const"

export default function(selectionModel, spanId) {
  const grid = document.querySelector(`#G${spanId}`)

  // Block span has no grid.
  if (grid) {
    const type = grid.querySelector(`.${TYPE_CLASS}`)
    const label = type.querySelector(`.${LABEL_CLASS}`)
    selectionModel.selectEntityLabel(label)
  }
}
