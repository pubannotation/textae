export default function(selectionModel, entitySelectChanged) {
  selectionModel
    .removeListener('entity.select', entitySelectChanged)
    .removeListener('entity.deselect', entitySelectChanged)
}
