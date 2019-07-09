import Container from './Container'
import setContainerDefinedTypes from './setContainerDefinedTypes'
import EntityContainer from './EntityContainer'

export default function(annotationData) {
  let isLockState = false
  const isLock = () => isLockState
  const lockEdit = () => isLockState = true
  const unlockEdit = () => isLockState = false

  const entityContainer = new EntityContainer(() => annotationData.entity.all(), '#77DDDD')
  const attributeContainer = new Container(() => annotationData.attribute.all(), '#77DDDD')
  const relationContaier = new Container(() => annotationData.relation.all(), '#555555')

  return {
    isLock,
    lockEdit,
    unlockEdit,
    entity: entityContainer,
    setDefinedEntityTypes: (newDefinedTypes) => setContainerDefinedTypes(entityContainer, newDefinedTypes),
    attribute: attributeContainer,
    setDefinedAttributeTypes: (newDefinedTypes) => setContainerDefinedTypes(attributeContainer, newDefinedTypes),
    relation: relationContaier,
    setDefinedRelationTypes: (newDefinedTypes) => setContainerDefinedTypes(relationContaier, newDefinedTypes),
    getConfig: () => {
      return {
        'entity types': entityContainer.getDefinedTypes(),
        // 'attribute types': attributeContainer.getDefinedTypes(),
        'relation types': relationContaier.getDefinedTypes()
      }
    }
  }
}

