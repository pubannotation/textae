import CreateSpanAndTypesCommand from '../CreateSpanAndTypesCommand'
import getReplicationSpans from './getReplicationSpans'
import CompositeCommand from '../CompositeCommand'
import idFactory from '../../../../idFactory'

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

    this._subCommands = getReplicationSpans(
      annotationData,
      span,
      detectBoundaryFunc
    ).map(
      (newSpan) =>
        new CreateSpanAndTypesCommand(
          editor,
          annotationData,
          selectionModel,
          newSpan,
          types
        )
    )
    this._logMessage = `replicate a span ${idFactory.makeSpanId(editor, span)}`
  }
}
