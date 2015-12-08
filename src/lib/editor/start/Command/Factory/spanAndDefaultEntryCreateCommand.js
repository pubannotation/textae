import {
  CreateCommand
}
from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'
import idFactory from '../../../idFactory'

export default function(editor, model, type, span) {
  const spanCreateCommand = (span) => new CreateCommand(model, 'span', true, span),
    entityCreateCommand = (entity) => new CreateCommand(model, 'entity', true, entity),
    id = idFactory.makeSpanId(editor, span),
    createSpan = spanCreateCommand(span),
    createEntity = entityCreateCommand({
      span: id,
      type: type
    }),
    subCommands = [createSpan, createEntity]

  return {
    execute: function() {
      executeCompositCommand('span', this, 'create', id, subCommands)
    }
  }
}
