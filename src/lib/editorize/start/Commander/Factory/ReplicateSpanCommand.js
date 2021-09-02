import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import CompositeCommand from './CompositeCommand'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'

export default class ReplicateSpanCommand extends CompositeCommand {
  constructor(
    editor,
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
        const spanId = makeDenotationSpanHTMLElementID(editor, begin, end)

        return new CreateSpanAndTypesCommand(
          editor,
          annotationData,
          selectionModel,
          spanId,
          begin,
          end,
          typeValeusList
        )
      })
    this._logMessage = `replicate a span ${makeDenotationSpanHTMLElementID(
      editor,
      span.begin,
      span.end
    )}`
  }
}
