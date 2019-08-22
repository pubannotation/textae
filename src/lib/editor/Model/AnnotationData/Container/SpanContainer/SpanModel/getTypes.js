import idFactory from '../../../../../idFactory'

export default function(entities) {
  return entities.reduce((array, entity) => {
    const id = idFactory.makeTypeId(entity)
    const type = array.find((type) => type.id === id)

    if (type) {
      type.entities.push(entity)
    } else {
      array.push({
        id,
        name: entity.type,
        entities: [entity]
      })
    }

    return array
  }, [])
}
