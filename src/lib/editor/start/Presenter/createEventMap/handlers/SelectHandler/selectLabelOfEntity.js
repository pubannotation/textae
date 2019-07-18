export default function(selectionModel, entity) {
  console.assert(entity, 'An entity MUST exists.')

  selectionModel.selectEntityLabel(entity.parentNode.nextElementSibling)
}
