export default function(annotationData, selectionModel, typeDefinition) {
  return (event) => {
    const firstId = selectionModel.span.single()
    const target = event.target
    const id = target.id

    if (event.shiftKey && firstId) {
      // select reange of spans.
      selectionModel.clear()
      for (const spanId of annotationData.span.range(firstId, id)) {
        selectSpanWithBlockEnities(
          annotationData,
          selectionModel,
          typeDefinition,
          spanId
        )
      }
    } else if (event.ctrlKey || event.metaKey) {
      selectionModel.span.toggle(id)
      annotationData.span
        .get(id)
        .getBlockEntities(typeDefinition)
        .forEach((id) => selectionModel.entity.toggle(id))
    } else {
      selectionModel.clear()
      selectSpanWithBlockEnities(
        annotationData,
        selectionModel,
        typeDefinition,
        id
      )
    }
  }
}

function selectSpanWithBlockEnities(
  annotationData,
  selectionModel,
  typeDefinition,
  spanId
) {
  selectionModel.span.add(spanId)

  annotationData.span
    .get(spanId)
    .getBlockEntities(typeDefinition)
    .forEach((entity) => selectionModel.entity.add(entity.id))
}
