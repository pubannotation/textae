import spanRemoveCommand from './spanRemoveCommand'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import _ from 'underscore'

export default function(editor, annotationData, selectionModel, ids) {
  const entityPerSpan = toEntityPerSpan(annotationData, ids)

  return _.flatten(
    Object
    .keys(entityPerSpan)
    .map(function(spanId) {
      var span = annotationData.span.get(spanId),
        targetIds = entityPerSpan[spanId],
        allEntitiesOfSpan = _.flatten(
          span
          .getTypes()
          .map(function(type) {
            return type.entities
          })
        ),
        restEntities = _.reject(
          allEntitiesOfSpan,
          function(entityId) {
            return _.contains(targetIds, entityId)
          }
        )

      return {
        entities: targetIds,
        spasId: spanId,
        noRestEntities: restEntities.length === 0
      }
    })
    .map(function(data) {
      if (data.noRestEntities)
        return spanRemoveCommand(editor, annotationData, selectionModel, data.spasId)
      else
        return data.entities.map(function(id) {
          return entityAndAssociatesRemoveCommand(editor, annotationData, selectionModel, id)
        })
    })
  )
}

function toEntityPerSpan(annotationData, ids) {
  return ids
    .map(function(id) {
      var span = annotationData.entity.get(id).span
      return {
        id: id,
        span: span
      }
    })
    .reduce(function(ret, entity) {
      var hoge = ret[entity.span] ? ret[entity.span] : []
      hoge.push(entity.id)
      ret[entity.span] = hoge
      return ret
    }, {})
}
