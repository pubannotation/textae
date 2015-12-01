import reduce2hash from '../../util/reduce2hash'
import defaultType from './defaultType'
import TypeContainer from './TypeContainer'

export default function(model) {
  const entityContainer = Object.assign(
      new TypeContainer(model.annotationData.entity.types, '#77DDDD'), {
        isBlock: (type) => {
          const definition = entityContainer.getDeinedType(type)
          return definition && definition.type && definition.type === 'block'
        }
      }),
    relationContaier = new TypeContainer(model.annotationData.relation.types, '#555555')

  return {
    entity: entityContainer,
    setDefinedEntityTypes: (newDefinedTypes) => setContainerDefinedTypes(entityContainer, newDefinedTypes),
    relation: relationContaier,
    setDefinedRelationTypes: (newDefinedTypes) => setContainerDefinedTypes(relationContaier, newDefinedTypes)
  }
}

function setContainerDefinedTypes(container, newDefinedTypes) {
  // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
  if (newDefinedTypes !== undefined) {
    container.setDefinedTypes(newDefinedTypes.reduce(reduce2hash('id'), {}))

    const defaultFromDefinedTypes = newDefinedTypes
      .filter((type) => type.default === true)
      .map((type) => type.id)
      .shift()

    container.setDefaultType(defaultFromDefinedTypes || defaultType)
  }
}
