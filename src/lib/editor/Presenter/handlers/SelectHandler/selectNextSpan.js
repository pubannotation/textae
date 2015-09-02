import selectSpan from './selectSpan'

export default function(annotationData, selectionModel, direction) {
  let spanId = selectionModel.span.single()

  if (spanId) {
    let span = annotationData.span.get(spanId)

    selectSpan(selectionModel, span[direction])
  }
}
