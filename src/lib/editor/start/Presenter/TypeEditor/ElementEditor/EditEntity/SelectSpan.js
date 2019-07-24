import _ from 'underscore'

export default function(
  editor,
  annotationData,
  selectionModel,
  typeDefinition
) {
  const getBlockEntities = (spanId) =>
    _.flatten(
      annotationData.span
        .get(spanId)
        .getTypes()
        .filter((type) => typeDefinition.entity.isBlock(type.name))
        .map((type) => type.entities.map((e) => e.id))
    )

  const operateSpanWithBlockEntities = (method, spanId) => {
    selectionModel.span[method](spanId)
    if (editor.find(`#${spanId}`).hasClass('textae-editor__span--block')) {
      getBlockEntities(spanId).forEach(selectionModel.entity[method])
    }
  }

  const selectSpanWithBlockEnities = _.partial(
    operateSpanWithBlockEntities,
    'add'
  )
  const toggleSpanWithBlockEnities = _.partial(
    operateSpanWithBlockEntities,
    'toggle'
  )

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
