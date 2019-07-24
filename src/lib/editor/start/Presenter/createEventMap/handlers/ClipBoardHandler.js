import _ from 'underscore'

module.exports = function(command, annotationData, selectionModel, clipBoard) {
  const copyEntities = function() {
    // Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
    clipBoard.clipBoard = _.uniq(
      (function getEntitiesFromSelectedSpan() {
        return _.flatten(
          selectionModel.span.all().map((spanId) => {
            return annotationData.span.get(spanId).getEntities()
          })
        )
      })().concat(selectionModel.entity.all())
    ).map((entityId) => {
      // Map entities to types, because entities may be delete.
      return annotationData.entity.get(entityId).type
    })
  }

  const pasteEntities = function() {
    // Make commands per selected spans from types in clipBoard.
    const commands = _.flatten(
      selectionModel.span.all().map((spanId) => {
        return clipBoard.clipBoard.map((type) => {
          return command.factory.entityCreateCommand({
            span: spanId,
            type
          })
        })
      })
    )

    command.invoke(commands, ['annotation'])
  }

  return {
    copyEntities,
    pasteEntities
  }
}
