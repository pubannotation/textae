import defaults from './defaults'
import Container from './Container'

export default function(editor, annotationData) {
  const entityContainer = Object.assign(
      new Container(annotationData.entity.all, annotationData.entity.types, '#77DDDD'), {
        isBlock: (type) => {
          const definition = entityContainer.getDefinedType(type)
          return definition && definition.type && definition.type === 'block'
        }
      }),
    attributeContainer = new Container(annotationData.attribute.all, annotationData.attribute.types, '#77DDDD'),
    relationContaier = new Container(annotationData.relation.all, annotationData.relation.types, '#555555')

  let isLockState = false

  return {
    isLock: isLockState,
    lockEdit: () => {
      isLockState = true
      console.log('textae.config.lock')
    },
    unlockEdit: () => {
      isLockState = false
      console.log('textae.config.unlock')
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
