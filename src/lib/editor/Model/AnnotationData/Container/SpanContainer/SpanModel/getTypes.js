import idFactory from '../../../../../idFactory'

export default function(entities) {
  return entities.reduce((typeList, entity) => {
    const typeId = idFactory.makeTypeId(entity)
    const type = typeList.find((type) => type.id === typeId)

    if (type) {
      type.entities.push(entity)
    } else {
      typeList.push({
        id: typeId,
        name: entity.type,
        entities: [entity]
      })
    }

    return typeList
  }, [])
}
