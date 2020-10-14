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
    typeValeusList,
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
          newSpan.begin,
          newSpan.end,
          typeValeusList
        )
    )
    this._logMessage = `replicate a span ${idFactory.makeSpanDomId(
      editor,
      span.begin,
      span.end
    )}`
  }
}
