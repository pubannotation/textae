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

    this.subCommands = getReplicationSpans(
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
          span.getTypes()
        )
    )
    this.id = span.id
  }

  execute() {
    super.execute('span', 'replicate', this.id, this.subCommands)
  }
}
