import SpanAndTypesCreateCommand from '../SpanAndTypesCreateCommand'
import getReplicationSpans from './getReplicationSpans'
import CompositeCommand from '../CompositeCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    span,
    detectBoundaryFunc
  ) {
    super()

    this._subCommands = getReplicationSpans(
      annotationData,
      span,
      detectBoundaryFunc
    ).map(
      (newSpan) =>
        new SpanAndTypesCreateCommand(
          editor,
          annotationData,
          selectionModel,
          newSpan,
          span.types
        )
    )
    this._logMessage = `replicate a span ${span.id}`
  }
}
