/**
 * Select entity.
 * @param {object} selectionModel - this is the selectionModel.
 * @param {string|array} entity - dom of entity to select or array of ids of entities.
 */
export default function(selectionModel, dom) {
  console.assert(selectionModel, 'selectionModel MUST exists.')

  // A entity may be null when the first or the last entity is selected at the Relation Edit Mode.
  if (dom) {
    selectionModel.clear()

    if (dom instanceof HTMLCollection) {
      selectionModel.entity.add(Array.from(dom).map(dom => dom.title))
    } else {
      selectionModel.entity.add(dom.title)
    }
  }
}
