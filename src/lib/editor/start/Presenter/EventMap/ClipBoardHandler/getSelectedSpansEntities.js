export default function(selectionModel, annotationData) {
  return selectionModel.span.all
    .map((id) => annotationData.span.get(id).entities.map((e) => e.id))
    .flat()
}
