export default function(command, selectionModel) {
  const spanIds = selectionModel.span.all()
  const entityIds = selectionModel.entity.all()
  const relationIds = selectionModel.relation.all()

  return getAll(command, spanIds, entityIds, relationIds)
}

function getAll(command, spanIds, entityIds, relationIds) {
  return [].concat(
    toRemoveRelationCommands(relationIds, command),
    toRemoveEntityCommands(entityIds, command),
    toRomeveSpanCommands(spanIds, command)
  )
}

function toRomeveSpanCommands(spanIds, command) {
  return spanIds.map((id) => command.factory.spanRemoveCommand(id))
}

function toRemoveEntityCommands(entityIds, command) {
  if (entityIds.length === 0) {
    return []
  }

  return [command.factory.entitiesRemoveCommand(entityIds)]
}

function toRemoveRelationCommands(relationIds, command) {
  return relationIds.map((id) => command.factory.relationRemoveCommand(id))
}
