import getEntityDom from '../../getEntityDom'
import getEntitiesDomOfType from '../../getEntitiesDomOfType'
import getPaneDomOfType from '../../../getPaneDomOfType'

export default function(editor, entityId, cssClass) {
  console.assert(entityId, 'An entity id is necessary.')
  const entity = getEntityDom(editor[0], entityId)

  // Entities of block span hos no dom elements.
  if (entity) {
    const entities = getEntitiesDomOfType(entity)
    const typePane = getPaneDomOfType(entity)
    const typeValues = typePane
      .closest('.textae-editor__type')
      .querySelector('.textae-editor__type-values')

    // Set class to the typeValues if all entities of its has class.
    if (entities.length === typePane.querySelectorAll(`.${cssClass}`).length) {
      typeValues.classList.add(cssClass)
      typePane.classList.add(cssClass)
    } else {
      typeValues.classList.remove(cssClass)
      typePane.classList.remove(cssClass)
    }
  }
}
