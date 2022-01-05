// Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
export default function (selectionModel) {
  return new Set(
    selectionModel.span.all
      .map((span) => span.entities)
      .flat()
      .concat(selectionModel.entity.all)
  )
}
