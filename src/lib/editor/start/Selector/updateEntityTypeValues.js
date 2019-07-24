import getEntityDom from '../getEntityDom'
import getEntitiesDomOfType from '../getEntitiesDomOfType'
import getPaneDomOfType from '../../getPaneDomOfType'
import SELECTED from './SELECTED'

export default function(editor, entityId) {
  console.assert(entityId, 'An entity id is necessary.')
  const entity = getEntityDom(editor[0], entityId)

  // Entities of block span hos no dom elements.
  if (entity) {
    const typePane = getPaneDomOfType(entity)
    const typeValues = typePane
      .closest('.textae-editor__type')
      .querySelector('.textae-editor__type-values')
    const entities = getEntitiesDomOfType(entity)

    // Select the typeValues if all entities is selected.
    if (entities.length === typePane.querySelectorAll(`.${SELECTED}`).length) {
      typeValues.classList.add(SELECTED)
      typePane.classList.add(SELECTED)
    } else {
      typeValues.classList.remove(SELECTED)
      typePane.classList.remove(SELECTED)
    }

    // You can click the attribute button when selecting at least one entity.
    if (typePane.querySelectorAll(`.${SELECTED}`).length) {
      typeValues.classList.add(
        'textae-editor__type-values--some_entity_selected'
      )
    } else {
      typeValues.classList.remove(
        'textae-editor__type-values--some_entity_selected'
      )
    }
  }
}
