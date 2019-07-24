import { GRID_CLASS } from './const'

export default function(selectionModel, label) {
  console.assert(label, 'A label MUST exists.')

  const spanId = label.closest(`.${GRID_CLASS}`).id.substring(1)
  selectionModel.selectSingleSpanById(spanId)
}
