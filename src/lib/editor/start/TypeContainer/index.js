import defaultType from './defaultType'
import Container from './Container'

export default function(model) {
  const entityContainer = Object.assign(
      new Container(model.annotationData.entity.types, '#77DDDD'), {
        isBlock: (type) => {
          const definition = entityContainer.getDefinedType(type)
          return definition && definition.type && definition.type === 'block'
        }
      }),
    relationContaier = new Container(model.annotationData.relation.types, '#555555')

  return {
    entity: entityContainer,
    setDefinedEntityTypes: (newDefinedTypes) => setContainerDefinedTypes(entityContainer, newDefinedTypes),
    relation: relationContaier,
    setDefinedRelationTypes: (newDefinedTypes) => setContainerDefinedTypes(relationContaier, newDefinedTypes),
    getConfig: () => {
      return {
        'entity types': entityContainer.getDefinedTypes(),
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

    container.setDefaultType(defaultFromDefinedTypes || defaultType)
  }
}
