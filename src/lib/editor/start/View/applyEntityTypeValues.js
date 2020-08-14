import getEntitiesDomOfType from '../getEntitiesDomOfType'
import getPaneDomOfType from '../../getPaneDomOfType'
import areAllSibilingEntitiesHasClass from './areAllSibilingEntitiesHasClass'

export default function(entity, cssClass) {
  console.assert(entity, 'An entity is necessary.')

  // Entities of block span hos no dom elements.
  if (entity) {
    const typePane = getPaneDomOfType(entity)
    const typeValues = typePane
      .closest('.textae-editor__type')
      .querySelector('.textae-editor__type-values')

    // Set class to the typeValues if all entities of its has class.
    if (areAllSibilingEntitiesHasClass(entity, cssClass)) {
      typeValues.classList.add(cssClass)
      typePane.classList.add(cssClass)
    } else {
      typeValues.classList.remove(cssClass)
      typePane.classList.remove(cssClass)
    }
  }
}
