import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import CompositeCommand from './CompositeCommand'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'

export default class ReplicateSpanCommand extends CompositeCommand {
  constructor(
    editorID,
    annotationModel,
    selectionModel,
    span,
    typeValeusList,
    isDelimiterFunc
  ) {
    super()

    this._subCommands = annotationModel
      .getReplicationRanges(span, isDelimiterFunc)
      .map(({ begin, end }) => {
        const spanId = makeDenotationSpanHTMLElementID(editorID, begin, end)

        return new CreateSpanAndTypesCommand(
          annotationModel,
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
