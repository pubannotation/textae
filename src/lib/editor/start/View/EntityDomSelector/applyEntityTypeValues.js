import getTypeDomOfEntityDom from '../../getTypeDomOfEntityDom'
import areAllSibilingEntitiesHasClass from '../areAllSibilingEntitiesHasClass'

export default function(entity, cssClass) {
  console.assert(entity, 'An entity is necessary.')

  const type = getTypeDomOfEntityDom(entity)
  const typeValues = type.querySelector('.textae-editor__type-values')

  // Set class to the typeValues if all entities of its has class.
  if (areAllSibilingEntitiesHasClass(entity, cssClass)) {
    type.classList.add(cssClass)
    typeValues.classList.add(cssClass)
  } else {
    type.classList.remove(cssClass)
    typeValues.classList.remove(cssClass)
  }
}
