import selectFirstEntityOfEntityLabel from './selectFirstEntityOfEntityLabel'
import selectFirstEntityLabelOfSpan from './selectFirstEntityLabelOfSpan'
import selectSelected from '../selectSelected'

export default function(editorDom, selectionModel) {
  // When one span is selected.
  const spanId = selectionModel.span.singleId

  if (spanId) {
    selectFirstEntityLabelOfSpan(selectionModel, spanId)
    return
  }

  // When one entity label is selected.
  const labels = selectSelected(editorDom, 'textae-editor__type-values')

  if (labels.length === 1) {
    selectFirstEntityOfEntityLabel(selectionModel, labels[0])
    return
  }
}
