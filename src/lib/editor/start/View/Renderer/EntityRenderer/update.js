export default function (selectionModel, namespace, typeContainer, entity) {
  entity.updateElement(
    namespace,
    typeContainer,
    selectionModel.entity.has(entity.id)
  )
}
