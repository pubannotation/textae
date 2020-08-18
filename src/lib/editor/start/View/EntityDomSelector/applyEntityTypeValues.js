import getTypeDomOfEntityDom from '../../getTypeDomOfEntityDom'
import getTypeValuesDom from '../getTypeValuesDom'

export default function(entity, cssClass) {
  console.assert(entity, 'An entity is necessary.')

  const type = getTypeDomOfEntityDom(entity)
  const typeValues = getTypeValuesDom(entity)

  // Set class to the typeValues if all entities of its has class.
  if (entity.classList.contains(cssClass)) {
    type.classList.add(cssClass)
    typeValues.classList.add(cssClass)
  } else {
    type.classList.remove(cssClass)
    typeValues.classList.remove(cssClass)
  }
}
