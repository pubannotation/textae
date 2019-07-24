import { CreateCommand } from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'
import idFactory from '../../../idFactory'

export default function(editor, annotationData, selectionModel, span, types) {
  const spanCreateCommand = (span) =>
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'span',
        true,
        span
      ),
    entityCreateCommand = (entity) =>
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'entity',
        true,
        entity
      ),
    id = idFactory.makeSpanId(editor, span),
    createSpan = spanCreateCommand(span),
    createEntities = types.map((type) =>
      entityCreateCommand({
        span: id,
        type: type
      })
    ),
    subCommands = [createSpan].concat(createEntities)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'create', id, subCommands)
    }
  }
}
