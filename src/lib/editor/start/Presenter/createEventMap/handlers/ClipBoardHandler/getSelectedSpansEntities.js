export default function(selectionModel, annotationData) {
  return selectionModel.span
    .all()
    .map((id) =>
      annotationData.span
        .get(id)
        .getEntities()
        .map((e) => e.id)
    )
    .flat()
}
