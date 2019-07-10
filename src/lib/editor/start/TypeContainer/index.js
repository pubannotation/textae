import EntityContainer from './EntityContainer'
import EditableContainer from './EditableContainer'
import Container from './Container'
import setContainerDefinedTypes from './setContainerDefinedTypes'

export default function(annotationData) {
  let isLockState = false
  const getLockStateFunc = () => isLockState
  const lockEdit = () => isLockState = true
  const unlockEdit = () => isLockState = false

  const entityContainer = new EntityContainer(() => annotationData.entity.all(), '#77DDDD', getLockStateFunc)
  const relationContaier = new EditableContainer(() => annotationData.relation.all(), '#555555', getLockStateFunc)
  const attributeContainer = new Container(() => annotationData.attribute.all(), '#77DDDD')

  return {
    isLock: getLockStateFunc,
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

