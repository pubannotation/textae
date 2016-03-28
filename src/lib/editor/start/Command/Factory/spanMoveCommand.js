import {
  CreateCommand
}
from './commandTemplate'
import idFactory from '../../../idFactory'
import spanRemoveCommand from './spanRemoveCommand'
import executeCompositCommand from './executeCompositCommand'

export default function spanMoveCommand(editor, model, spanId, newSpan) {
  const spanCreateCommand = (span) => new CreateCommand(model, 'span', true, span),
    entityCreateCommand = (entity) => new CreateCommand(model, 'entity', true, entity),
    relationCreateCommand = (relation) => new CreateCommand(model, 'relation', false, relation),
    newSpanId = idFactory.makeSpanId(editor, newSpan),
    d = model.annotationData

  let subCommands = []

  if (!d.span.get(newSpanId)) {
    subCommands.push(spanRemoveCommand(model, spanId))
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

      // Clear text selection
      if (window.getSelection().empty) { // Chrome
        window.getSelection().empty()
      } else if (window.getSelection().removeAllRanges) { // Firefox
        window.getSelection().removeAllRanges()
      }
    }
  }
}
