import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import CompositeCommand from './CompositeCommand'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'

export default class ReplicateSpanCommand extends CompositeCommand {
  constructor(
    editorID,
    annotationData,
    selectionModel,
    span,
    typeValeusList,
    isDelimiterFunc
  ) {
    super()

    this._subCommands = annotationData
      .getReplicationRanges(span, isDelimiterFunc)
      .map(({ begin, end }) => {
        const spanId = makeDenotationSpanHTMLElementID(editorID, begin, end)

        return new CreateSpanAndTypesCommand(
          annotationData,
          selectionModel,
          spanId,
          begin,
          end,
          typeValeusList
        )
      })
    this._logMessage = `from span: ${makeDenotationSpanHTMLElementID(
      editorID,
      span.begin,
      span.end
    )}`
  }
}
