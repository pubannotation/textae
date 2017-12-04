import {
  CreateCommand
}
from './commandTemplate'
import idFactory from '../../../idFactory'
import spanRemoveCommand from './spanRemoveCommand'
import executeCompositCommand from './executeCompositCommand'

export default function spanMoveCommand(editor, annotationData, selectionModel, spanId, newSpan) {
  const spanCreateCommand = (span) => new CreateCommand(editor, annotationData, selectionModel, 'span', true, span),
    entityCreateCommand = (entity) => new CreateCommand(editor, annotationData, selectionModel, 'entity', true, entity),
    relationCreateCommand = (relation) => new CreateCommand(editor, annotationData, selectionModel, 'relation', false, relation),
    newSpanId = idFactory.makeSpanId(editor, newSpan),
    d = annotationData

  let subCommands = []

  if (!d.span.get(newSpanId)) {
    subCommands.push(spanRemoveCommand(editor, annotationData, selectionModel, spanId))
    subCommands.push(spanCreateCommand({
      begin: newSpan.begin,
      end: newSpan.end
    }))
    d.span.get(spanId).getTypes().forEach(function(type) {
      type.entities.forEach(function(id) {
        subCommands.push(entityCreateCommand({
          id: id,
          span: newSpanId,
          type: type.name
        }))

        subCommands = subCommands.concat(
          d.entity.assosicatedRelations(id)
          .map(d.relation.get)
          .map(function(relation) {
            return relationCreateCommand(relation)
          })
        )
      })
    })
  }

  return {
    execute: function() {
      executeCompositCommand('span', this, 'move', spanId, subCommands)
    }
  }
}
