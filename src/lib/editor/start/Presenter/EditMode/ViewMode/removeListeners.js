export default function(
  selectionModel,
  entitySelectChanged,
  buttonStateHelper
) {
  selectionModel
    .removeListener('entity.select', entitySelectChanged)
    .removeListener('entity.deselect', entitySelectChanged)
    .removeListener('entity.change', entitySelectChanged)
    .removeListener('entity.change', () => buttonStateHelper.updateByEntity())
}
