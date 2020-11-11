import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import CompositeCommand from './CompositeCommand'
import { makeDenotationSpanHTMLElementId } from '../../../idFactory'

export default class extends CompositeCommand {
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
        const spanId = makeDenotationSpanHTMLElementId(editor, begin, end)

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
    this._logMessage = `replicate a span ${makeDenotationSpanHTMLElementId(
      editor,
      span.begin,
      span.end
    )}`
  }
}
