export default function(
  editor,
  annotationData,
  selectionModel,
  typeDefinition
) {
  const getBlockEntities = (spanId) =>
    annotationData.span
      .get(spanId)
      .entities.filter((entity) =>
        typeDefinition.entity.isBlock(entity.type.name)
      )
      .map((e) => e.id)

  const operateSpanWithBlockEntities = (method, spanId) => {
    selectionModel.span[method](spanId)
    if (editor.find(`#${spanId}`).hasClass('textae-editor__span--block')) {
      getBlockEntities(spanId).forEach(selectionModel.entity[method])
    }
  }

  const selectSpanWithBlockEnities = (spanId) =>
    operateSpanWithBlockEntities('add', spanId)
  const toggleSpanWithBlockEnities = (id) =>
    operateSpanWithBlockEntities('toggle', id)

  return (event) => {
    const firstId = selectionModel.span.single()
    const target = event.target
    const id = target.id

    if (event.shiftKey && firstId) {
      // select reange of spans.
      selectionModel.clear()
      annotationData.span
        .range(firstId, id)
        .forEach((spanId) => selectSpanWithBlockEnities(spanId))
    } else if (event.ctrlKey || event.metaKey) {
      toggleSpanWithBlockEnities(id)
    } else {
      selectionModel.clear()
      selectSpanWithBlockEnities(id)
    }
  }
}
