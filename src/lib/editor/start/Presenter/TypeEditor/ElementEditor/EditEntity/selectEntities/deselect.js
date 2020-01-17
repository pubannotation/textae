export default function(selectionModel, entities) {
  for (const entity of entities) {
    selectionModel.entity.remove(entity.title)
  }
}
