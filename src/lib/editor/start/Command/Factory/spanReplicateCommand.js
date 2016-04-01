import spanAndDefaultEntryCreateCommand from './spanAndDefaultEntryCreateCommand'
import getReplicationSpans from './getReplicationSpans'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, annotationData, selectionModel, type, span, detectBoundaryFunc) {
  const createSpan = (span) => spanAndDefaultEntryCreateCommand(editor, annotationData, selectionModel, type, span),
    subCommands = getReplicationSpans(annotationData, span, detectBoundaryFunc)
    .map(createSpan)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'replicate', span.id, subCommands)
    }
  }
}
