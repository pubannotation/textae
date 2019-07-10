import Observable from 'observ'
import EntityContainer from './EntityContainer'
import EditableContainer from './EditableContainer'
import Container from './Container'
import setContainerDefinedTypes from './setContainerDefinedTypes'

export default function(annotationData) {
  const lockStateObservable = new Observable(false)

  const entityContainer = new EntityContainer(() => annotationData.entity.all(), '#77DDDD', lockStateObservable)
  const relationContaier = new EditableContainer(() => annotationData.relation.all(), '#555555', lockStateObservable)
  const attributeContainer = new Container(() => annotationData.attribute.all(), '#77DDDD')

  return {
    isLock: lockStateObservable,
    lockEdit() {
      lockStateObservable.set(true)
    },
    unlockEdit() {
      lockStateObservable.set(false)
    },
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

