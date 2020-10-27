import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import CompositeCommand from './CompositeCommand'
import { makeDenotationSpanDomId } from '../../../idFactory'

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
      .map(
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
    this._logMessage = `replicate a span ${makeDenotationSpanDomId(
      editor,
      span.begin,
      span.end
    )}`
  }
}
