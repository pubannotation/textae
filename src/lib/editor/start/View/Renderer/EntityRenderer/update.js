export default function (selectionModel, namespace, typeContainer, entity) {
  const entityElement = entity.element
  const element = entity.renderElement(namespace, typeContainer)
  entityElement.replaceWith(element)

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    entity.select()
  }
}
