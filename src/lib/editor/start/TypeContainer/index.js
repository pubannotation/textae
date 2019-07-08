import Container from './Container'

export default function(annotationData) {
  let isLockState = false
  const isLock = () => isLockState
  const lockEdit = () => isLockState = true
  const unlockEdit = () => isLockState = false

  const entityContainer = Object.assign(
      new Container(() => annotationData.entity.all(), '#77DDDD', isLock, lockEdit, unlockEdit), {
        isBlock: (type) => {
          const definition = entityContainer.getDefinedType(type)
          return definition && definition.type && definition.type === 'block'
        }
      }),
    attributeContainer = new Container(() => annotationData.attribute.all(), '#77DDDD', isLock, lockEdit, unlockEdit),
    relationContaier = new Container(() => annotationData.relation.all(), '#555555', isLock, lockEdit, unlockEdit)

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

function setContainerDefinedTypes(container, newDefinedTypes) {
  // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
  if (newDefinedTypes !== undefined) {
    container.setDefinedTypes(newDefinedTypes)

    const defaultFromDefinedTypes = newDefinedTypes
      .filter((type) => type.default === true)
      .map((type) => type.id)
      .shift()

    if (defaultFromDefinedTypes) {
      container.setDefaultType(defaultFromDefinedTypes)
    }
  }
}
