import CreateSpanAndTypesCommand from '../CreateSpanAndTypesCommand'
import getReplicationSpans from './getReplicationSpans'
import CompositeCommand from '../CompositeCommand'
import { makeSpanDomId } from '../../../../idFactory'

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
      ({ begin, end }) =>
        new CreateSpanAndTypesCommand(
          editor,
          annotationData,
          selectionModel,
          begin,
          end,
          typeValeusList
        )
    )
    this._logMessage = `replicate a span ${makeSpanDomId(
      editor,
      span.begin,
      span.end
    )}`
  }
}
