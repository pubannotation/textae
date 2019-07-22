import spanRemoveCommand from './spanRemoveCommand'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import _ from 'underscore'

export default function(editor, annotationData, selectionModel, ids) {
  const entityPerSpan = toEntityPerSpan(annotationData, ids)

  return _.flatten(
    Object
      .keys(entityPerSpan)
      .map((spanId) => {
        const span = annotationData.span.get(spanId)
        const targetIds = entityPerSpan[spanId]

        const allEntitiesOfSpan = _.flatten(
          span
            .getTypes()
            .map((type) => type.entities)
        )

        const restEntities = _.reject(
          allEntitiesOfSpan,
          (entityId) => _.contains(targetIds, entityId)
        )

        return {
          entities: targetIds,
          spasId: spanId,
          noRestEntities: restEntities.length === 0
        }
      })
      .map((data) => {
        if (data.noRestEntities) {
          return spanRemoveCommand(editor, annotationData, selectionModel, data.spasId)
        } else {
          return data.entities.map((id) => entityAndAssociatesRemoveCommand(editor, annotationData, selectionModel, id))
        }
      })
  )
}

function toEntityPerSpan(annotationData, ids) {
  return ids
    .map((id) => {
      const span = annotationData.entity.get(id).span

      return {
        id,
        span
      }
    })
    .reduce((ret, entity) => {
      const hoge = ret[entity.span] ? ret[entity.span] : []

      hoge.push(entity.id)
      ret[entity.span] = hoge

      return ret
    }, {})
}
