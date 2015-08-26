export default function(annotationData, selectionModel) {
  return {
    selectLeftSpan: () => selectNextSpan(annotationData, selectionModel, 'left'),
    selectRightSpan: () => selectNextSpan(annotationData, selectionModel, 'right')
  }
}

function selectNextSpan(annotationData, selectionModel, direction) {
  let spanId = selectionModel.span.single()

  if (spanId) {
    let span = annotationData.span.get(spanId)

    if (span[direction]) {
      selectionModel.clear()
      selectionModel.span.add(span[direction].id)
    }
  }
}
