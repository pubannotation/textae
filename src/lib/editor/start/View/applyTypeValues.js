import getTypeDomOfEntityDom from '../getTypeDomOfEntityDom'
import areAllSibilingEntitiesHasClass from './areAllSibilingEntitiesHasClass'

export default function(entity, cssClass) {
  // Entities of block span hos no dom elements.
  if (entity) {
    const typeValues = getTypeDomOfEntityDom(entity).querySelector(
      '.textae-editor__type-values'
    )

    // Set class to the typeValues if all entities of its has class.
    if (areAllSibilingEntitiesHasClass(entity, cssClass)) {
      typeValues.classList.add(cssClass)
    } else {
      typeValues.classList.remove(cssClass)
    }
  }
}
