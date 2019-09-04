import idFactory from '../../../../../idFactory'

export default function(entities) {
  return entities.reduce((typeList, entity) => {
    const type = typeList.find(
      (type) => type.id === idFactory.makeTypeId(entity)
    )

    if (type) {
      type.entities.push(entity)
    } else {
      typeList.push(entity.type)
    }

    return typeList
  }, [])
}
