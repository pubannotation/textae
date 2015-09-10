/**
 * Select entity.
 * @param {object} selectionModel - this is the selectionModel.
 * @param {string|array} entity - dom of entity to select or array of ids of entities.
 */
export default function(selectionModel, entity) {
  console.assert(selectionModel, 'selectionModel MUST exists.')
  console.assert(entity, 'entity MUST exists.')

  selectionModel.clear()

  if (entity.forEach) {
    entity.forEach(i => selectionModel.entity.add(i))
  } else {
    selectionModel.entity.add(entity.title)
  }
}
