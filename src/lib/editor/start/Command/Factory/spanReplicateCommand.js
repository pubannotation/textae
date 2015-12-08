import spanAndDefaultEntryCreateCommand from './spanAndDefaultEntryCreateCommand'
import getReplicationSpans from './getReplicationSpans'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, model, type, span, detectBoundaryFunc) {
  const createSpan = (span) => spanAndDefaultEntryCreateCommand(editor, model, type, span),
    subCommands = getReplicationSpans(model.annotationData, span, detectBoundaryFunc)
    .map(createSpan)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'replicate', span.id, subCommands)
    }
  }
}
