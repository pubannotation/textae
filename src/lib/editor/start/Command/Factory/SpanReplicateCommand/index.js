import SpanAndTypesCreateCommand from '../SpanAndTypesCreateCommand'
import getReplicationSpans from './getReplicationSpans'
import CompositeCommand from '../CompositeCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    span,
    types,
    detectBoundaryFunc
  ) {
    super()
    const createSpan = (span) =>
      new SpanAndTypesCreateCommand(
        editor,
        annotationData,
        selectionModel,
        span,
        types
      )
    this.subCommands = getReplicationSpans(
      annotationData,
      span,
      detectBoundaryFunc
    ).map(createSpan)
    this.span = span
  }

  execute() {
    super.execute('span', 'replicate', this.span.id, this.subCommands)
  }
}
