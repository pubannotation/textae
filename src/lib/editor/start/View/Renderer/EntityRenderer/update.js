export default function (selectionModel, namespace, typeContainer, entity) {
  entity.updateElement(namespace, typeContainer)

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    entity.select()
  }
}
