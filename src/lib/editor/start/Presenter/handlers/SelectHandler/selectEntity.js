/**
 * Select entity.
 * @param {object} selectionModel - this is the selectionModel.
 * @param {string} dom - dom of entity to select or array of ids of entities.
 * @param {bool} isMulti - select multi elements.
 * @return {undefined}
 */
export default function(selectionModel, dom, isMulti) {
  console.assert(selectionModel, 'selectionModel MUST exists.')

  // A entity may be null when the first or the last entity is selected at the Relation Edit Mode.
  if (dom) {
    if (!isMulti)
      selectionModel.clear()

    selectionModel.entity.add(dom.title)
  }
}
