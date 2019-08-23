import idFactory from '../../../../../idFactory'
import TypeModel from '../TypeModel'

export default function(entities) {
  return entities.reduce((typeList, entity) => {
    const typeId = idFactory.makeTypeId(entity)
    const type = typeList.find((type) => type.id === typeId)

    if (type) {
      type.entities.push(entity)
    } else {
      typeList.push(new TypeModel(entity.type, typeId, entity))
    }

    return typeList
  }, [])
}
