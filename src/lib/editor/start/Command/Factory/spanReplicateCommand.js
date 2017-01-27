import spanAndTypesCreateCommand from './spanAndTypesCreateCommand'
import getReplicationSpans from './getReplicationSpans'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, annotationData, selectionModel, span, types, detectBoundaryFunc) {
  const createSpan = (span) => spanAndTypesCreateCommand(editor, annotationData, selectionModel, span, types),
    subCommands = getReplicationSpans(annotationData, span, detectBoundaryFunc)
    .map(createSpan)

  return {
    execute: function() {
      executeCompositCommand('span', this, 'replicate', span.id, subCommands)
    }
  }
}
