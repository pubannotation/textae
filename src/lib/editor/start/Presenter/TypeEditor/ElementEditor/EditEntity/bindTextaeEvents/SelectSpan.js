export default function(annotationData, selectionModel) {
  return (event) => {
    const firstId = selectionModel.span.singleId
    const targetId = event.target.id

    if (event.shiftKey && firstId) {
      // select reange of spans.
      selectionModel.clear()
      for (const spanId of annotationData.span.range(firstId, targetId)) {
        selectionModel.selectSpanWithBlockEntities(spanId)
      }
    } else if (event.ctrlKey || event.metaKey) {
      selectionModel.toggleSpanWithBlockEntities(targetId)
    } else {
      selectionModel.clear()
      selectionModel.selectSpanWithBlockEntities(targetId)
    }
  }
}
