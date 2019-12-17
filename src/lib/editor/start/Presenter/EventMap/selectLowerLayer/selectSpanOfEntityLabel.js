export default function(selectionModel, label) {
  console.assert(label, 'A label MUST exists.')

  const spanId = label.closest('.textae-editor__grid').id.substring(1)
  selectionModel.selectSingleSpanById(spanId)
}
