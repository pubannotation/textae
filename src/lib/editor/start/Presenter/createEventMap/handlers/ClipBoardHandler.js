import _ from 'underscore'

export default function(command, annotationData, selectionModel, clipBoard) {
  return {
    copyEntities: () => copyEntities(clipBoard, selectionModel, annotationData),
    pasteEntities: () => pasteEntities(selectionModel, clipBoard, command)
  }
}

// Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
function copyEntities(clipBoard, selectionModel, annotationData) {
  clipBoard.clipBoard = _.uniq(
    (function getEntitiesFromSelectedSpan() {
      return _.flatten(
        selectionModel.span.all().map((spanId) => {
          return annotationData.span
            .get(spanId)
            .getEntities()
            .map((e) => e.id)
        })
      )
    })().concat(selectionModel.entity.all())
  ).map((entityId) => {
    // Map entities to types, because entities may be delete.
    return annotationData.entity.get(entityId).type
  })
}

// Make commands per selected spans from types in clipBoard.
function pasteEntities(selectionModel, clipBoard, command) {
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
