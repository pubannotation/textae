export default function (selectionModel) {
  return selectionModel.span.all.map((span) => span.entities).flat()
}
